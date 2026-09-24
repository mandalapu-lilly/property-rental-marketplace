import mongoose from 'mongoose';
import Property from '../models/Property.js';

/**
 * @desc    Create a new property listing
 * @route   POST /api/properties
 * @access  Private (Host or Admin only)
 */
export const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      price,
      location,
      address,
      city,
      state,
      country,
      coordinates,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      status,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !propertyType ||
      price === undefined ||
      !location ||
      !address ||
      !city ||
      !state ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      area === undefined
    ) {
      return res.status(400).json({
        error: 'Please provide all required fields: title, description, propertyType, price, location, address, city, state, bedrooms, bathrooms, and area',
      });
    }

    // Sanitize and validate coordinates if provided
    let parsedCoordinates = undefined;
    if (coordinates && coordinates.latitude !== undefined && coordinates.longitude !== undefined && coordinates.latitude !== '' && coordinates.longitude !== '') {
      const lat = Number(coordinates.latitude);
      const lng = Number(coordinates.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ error: 'Latitude must be a valid number between -90 and 90' });
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return res.status(400).json({ error: 'Longitude must be a valid number between -180 and 180' });
      }
      parsedCoordinates = { latitude: lat, longitude: lng };
    }

    // Sanitize and normalize amenities and images
    const parsedAmenities = Array.isArray(amenities)
      ? amenities
      : typeof amenities === 'string' && amenities.trim()
      ? amenities.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

    const parsedImages = Array.isArray(images)
      ? images.filter((img) => typeof img === 'string' && img.trim() !== '')
      : typeof images === 'string' && images.trim()
      ? images.split(',').map((img) => img.trim()).filter(Boolean)
      : [];

    // Create property with owner derived STRICTLY from req.user._id
    const property = await Property.create({
      title: title.trim(),
      description: description.trim(),
      propertyType,
      price: Number(price),
      location: location.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country ? country.trim() : 'India',
      coordinates: parsedCoordinates,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      amenities: parsedAmenities,
      images: parsedImages,
      owner: req.user._id,
      status: status === 'unavailable' ? 'unavailable' : 'available',
    });

    await property.populate('owner', 'name email role');

    return res.status(201).json({
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all properties with optional search/filtering and sorting
 * @route   GET /api/properties
 * @access  Public
 */
export const getProperties = async (req, res, next) => {
  try {
    const { city, propertyType, minPrice, maxPrice, bedrooms, bathrooms, search, sort, status } = req.query;

    // 1. Query parameter validation
    if (minPrice !== undefined && minPrice !== '') {
      const numMin = Number(minPrice);
      if (isNaN(numMin) || numMin < 0) {
        return res.status(400).json({
          error: 'Invalid minPrice parameter. It must be a non-negative number.',
        });
      }
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      const numMax = Number(maxPrice);
      if (isNaN(numMax) || numMax < 0) {
        return res.status(400).json({
          error: 'Invalid maxPrice parameter. It must be a non-negative number.',
        });
      }
    }

    if (
      minPrice !== undefined &&
      minPrice !== '' &&
      maxPrice !== undefined &&
      maxPrice !== '' &&
      Number(minPrice) > Number(maxPrice)
    ) {
      return res.status(400).json({
        error: 'minPrice cannot be greater than maxPrice.',
      });
    }

    if (bedrooms !== undefined && bedrooms !== '') {
      const numBeds = Number(bedrooms);
      if (isNaN(numBeds) || numBeds < 0) {
        return res.status(400).json({
          error: 'Invalid bedrooms parameter. It must be a non-negative number.',
        });
      }
    }

    if (bathrooms !== undefined && bathrooms !== '') {
      const numBaths = Number(bathrooms);
      if (isNaN(numBaths) || numBaths < 0) {
        return res.status(400).json({
          error: 'Invalid bathrooms parameter. It must be a non-negative number.',
        });
      }
    }

    const filter = {};

    // 2. Availability filter (default: available)
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'available';
    }

    // 3. City filter (case-insensitive regex)
    if (city && city.trim() !== '') {
      const safeCity = city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.city = { $regex: new RegExp(safeCity, 'i') };
    }

    // 4. Property Type filter (exact match)
    if (propertyType && propertyType.trim() !== '' && propertyType !== 'All' && propertyType !== 'All Types') {
      filter.propertyType = propertyType.trim();
    }

    // 5. Price range filter
    if ((minPrice !== undefined && minPrice !== '') || (maxPrice !== undefined && maxPrice !== '')) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // 6. Minimum bedrooms filter
    if (bedrooms !== undefined && bedrooms !== '' && bedrooms !== 'Any') {
      filter.bedrooms = { $gte: Number(bedrooms) };
    }

    // 7. Minimum bathrooms filter
    if (bathrooms !== undefined && bathrooms !== '' && bathrooms !== 'Any') {
      filter.bathrooms = { $gte: Number(bathrooms) };
    }

    // 8. General search keyword across title, location, city, and address
    if (search && search.trim() !== '') {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      filter.$or = [
        { title: regex },
        { location: regex },
        { city: regex },
        { address: regex },
      ];
    }

    // 9. Sorting options
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') {
      sortOptions = { price: 1, createdAt: -1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1, createdAt: -1 };
    } else if (sort === 'rating_desc') {
      sortOptions = { averageRating: -1, totalReviews: -1, createdAt: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email role')
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured top properties for Home page
 * @route   GET /api/properties/featured
 * @access  Public
 */
export const getFeaturedProperties = async (req, res, next) => {
  try {
    const featured = await Property.find({ status: 'available' })
      .populate('owner', 'name email role')
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      count: featured.length,
      properties: featured,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single property details by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: 'Property not found (invalid ID format)',
      });
    }

    const property = await Property.findById(id).populate('owner', 'name email role');

    if (!property) {
      return res.status(404).json({
        error: 'Property not found',
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get similar property recommendations based on city or propertyType
 * @route   GET /api/properties/:id/similar
 * @access  Public
 */
export const getSimilarProperties = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Invalid property ID' });
    }

    const currentProp = await Property.findById(id);
    if (!currentProp) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const similar = await Property.find({
      _id: { $ne: currentProp._id },
      status: 'available',
      $or: [
        { city: currentProp.city },
        { propertyType: currentProp.propertyType },
      ],
    })
      .populate('owner', 'name email role')
      .limit(4);

    return res.status(200).json({
      success: true,
      count: similar.length,
      properties: similar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get properties listed by the authenticated user
 * @route   GET /api/properties/my
 * @access  Private (Authenticated users)
 */
export const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing property
 * @route   PUT /api/properties/:id
 * @access  Private (Owner or Admin only)
 */
export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: 'Property not found (invalid ID format)',
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        error: 'Property not found',
      });
    }

    // Verify ownership or admin role
    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden: You do not have permission to modify this property',
      });
    }

    const {
      title,
      description,
      propertyType,
      price,
      location,
      address,
      city,
      state,
      country,
      coordinates,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      status,
    } = req.body;

    // Update allowed fields
    if (title !== undefined) property.title = title.trim();
    if (description !== undefined) property.description = description.trim();
    if (propertyType !== undefined) property.propertyType = propertyType;
    if (price !== undefined) property.price = Number(price);
    if (location !== undefined) property.location = location.trim();
    if (address !== undefined) property.address = address.trim();
    if (city !== undefined) property.city = city.trim();
    if (state !== undefined) property.state = state.trim();
    if (country !== undefined) property.country = country.trim();
    if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);
    if (area !== undefined) property.area = Number(area);
    if (status !== undefined) property.status = status;

    if (coordinates !== undefined) {
      if (coordinates && coordinates.latitude !== undefined && coordinates.longitude !== undefined && coordinates.latitude !== '' && coordinates.longitude !== '') {
        const lat = Number(coordinates.latitude);
        const lng = Number(coordinates.longitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
          return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
        }
        if (isNaN(lng) || lng < -180 || lng > 180) {
          return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
        }
        property.coordinates = { latitude: lat, longitude: lng };
      } else {
        property.coordinates = undefined;
      }
    }

    if (amenities !== undefined) {
      property.amenities = Array.isArray(amenities)
        ? amenities
        : typeof amenities === 'string'
        ? amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [];
    }

    if (images !== undefined) {
      property.images = Array.isArray(images)
        ? images.filter((img) => typeof img === 'string' && img.trim() !== '')
        : typeof images === 'string'
        ? images.split(',').map((img) => img.trim()).filter(Boolean)
        : [];
    }

    const updatedProperty = await property.save();
    await updatedProperty.populate('owner', 'name email role');

    return res.status(200).json({
      message: 'Property updated successfully',
      property: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a property
 * @route   DELETE /api/properties/:id
 * @access  Private (Owner or Admin only)
 */
export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        error: 'Property not found (invalid ID format)',
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        error: 'Property not found',
      });
    }

    // Verify ownership or admin role
    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden: You do not have permission to delete this property',
      });
    }

    await Property.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Property deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
