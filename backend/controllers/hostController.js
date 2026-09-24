import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

/**
 * @desc    Get host dashboard summary metrics
 * @route   GET /api/host/stats
 * @access  Private (Host or Admin only)
 */
export const getHostStats = async (req, res, next) => {
  try {
    const hostId = req.user._id;

    // 1. Properties metrics
    const properties = await Property.find({ owner: hostId });
    const totalProperties = properties.length;
    const availableProperties = properties.filter((p) => p.status === 'available').length;
    const propertyIds = properties.map((p) => p._id);

    // 2. Bookings metrics
    const bookings = await Booking.find({ host: hostId });
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').length;

    // 3. Estimated earnings
    const totalEarnings = bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'completed')
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    // 4. Reviews metrics
    const reviews = await Review.find({ property: { $in: propertyIds } });
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? Math.round((reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews) * 10) / 10
        : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalProperties,
        availableProperties,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalEarnings,
        totalReviews,
        avgRating,
      },
    });
  } catch (error) {
    next(error);
  }
};
