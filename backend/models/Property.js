import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: {
        values: [
          'Apartment',
          'House',
          'Villa',
          'Hotel',
          'Resort',
          'Homestay',
          'Guest House',
          'Room',
          'Studio',
          'Penthouse',
          'Cottage',
          'Other',
        ],
        message: '{VALUE} is not a valid property type',
      },
      default: 'Apartment',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    location: {
      type: String,
      required: [true, 'Location/Area is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'India',
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative'],
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms cannot be negative'],
      default: 1,
    },
    area: {
      type: Number,
      required: [true, 'Area (in sq ft) is required'],
      min: [1, 'Area must be greater than 0'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Property owner is required'],
    },
    status: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true,
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and filtering
propertySchema.index({ city: 1, propertyType: 1, price: 1, status: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ averageRating: -1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;
