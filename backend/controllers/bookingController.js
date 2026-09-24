import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

/**
 * @desc    Create a new property booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (req, res, next) => {
  try {
    const { propertyId, startDate, endDate, guests } = req.body;

    if (!propertyId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Please provide propertyId, startDate, and endDate',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid startDate or endDate format' });
    }

    if (start < today) {
      return res.status(400).json({ error: 'Start date cannot be in the past' });
    }

    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const numGuests = Number(guests) || 1;
    if (numGuests < 1) {
      return res.status(400).json({ error: 'Guests must be at least 1' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.status === 'unavailable') {
      return res.status(400).json({ error: 'Property is currently unavailable for booking' });
    }

    // Rule 5: User cannot book their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot book your own property' });
    }

    // Rule 6: Check for date overlaps with active bookings
    const overlappingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ['pending', 'confirmed'] },
      startDate: { $lt: end },
      endDate: { $gt: start },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        error: 'The requested dates overlap with an existing booking for this property',
      });
    }

    // Calculate server-side total price (never trust frontend)
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // For monthly pricing or daily approximation, price per night = price / 30 or direct duration
    // Let's use clean nightly rate = Math.round(property.price / 30) with minimum of 1 night or duration
    const pricePerNight = Math.max(1, Math.round(property.price / 30));
    const totalPrice = nights * pricePerNight;

    const booking = await Booking.create({
      property: propertyId,
      user: req.user._id,
      host: property.owner,
      startDate: start,
      endDate: end,
      guests: numGuests,
      totalPrice,
      status: 'pending',
    });

    await booking.populate([
      { path: 'property', select: 'title location city images price' },
      { path: 'host', select: 'name email' },
      { path: 'user', select: 'name email' },
    ]);

    return res.status(201).json({
      message: 'Booking request created successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings made by authenticated user
 * @route   GET /api/bookings/my
 * @access  Private
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'property',
        select: 'title location city price images propertyType address',
        populate: { path: 'owner', select: 'name email' },
      })
      .populate('host', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings for properties owned by authenticated host
 * @route   GET /api/bookings/host
 * @access  Private (Host or Admin)
 */
export const getHostBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ host: req.user._id })
      .populate('property', 'title location city price images propertyType address')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = await Booking.findById(id)
      .populate('property')
      .populate('user', 'name email')
      .populate('host', 'name email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const isUser = booking.user._id.toString() === req.user._id.toString();
    const isHost = booking.host._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isUser && !isHost && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You cannot access this booking' });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const isUser = booking.user.toString() === req.user._id.toString();
    const isHost = booking.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isUser && !isHost && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You cannot cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Completed bookings cannot be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    return res.status(200).json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Confirm a booking (Host / Admin)
 * @route   PUT /api/bookings/:id/confirm
 * @access  Private (Host or Admin)
 */
export const confirmBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const isHost = booking.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Only the property host or admin can confirm bookings' });
    }

    booking.status = 'confirmed';
    await booking.save();

    return res.status(200).json({
      message: 'Booking confirmed successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject a booking (Host / Admin)
 * @route   PUT /api/bookings/:id/reject
 * @access  Private (Host or Admin)
 */
export const rejectBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const isHost = booking.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Only the property host or admin can reject bookings' });
    }

    booking.status = 'rejected';
    await booking.save();

    return res.status(200).json({
      message: 'Booking rejected',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings (Admin only)
 * @route   GET /api/bookings
 * @access  Private (Admin only)
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'title location city price images')
      .populate('user', 'name email')
      .populate('host', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
