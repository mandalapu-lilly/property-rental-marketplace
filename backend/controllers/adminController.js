import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

/**
 * @desc    Get overall system metrics for Admin Dashboard
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHosts = await User.countDocuments({ role: 'host' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalProperties = await Property.countDocuments();
    const availableProperties = await Property.countDocuments({ status: 'available' });

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const totalReviews = await Review.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalHosts,
        totalAdmins,
        totalProperties,
        availableProperties,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users list
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user's role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin only)
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['user', 'host', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Valid role must be user, host, or admin' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Protect against self-demotion if current admin
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot remove your own admin role' });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a user account
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot delete your own admin account' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Clean up properties, favorites, and bookings by user
    await Property.deleteMany({ owner: id });
    await Booking.deleteMany({ user: id });
    await Review.deleteMany({ user: id });

    return res.status(200).json({
      message: 'User and associated data removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all properties for admin overview
 * @route   GET /api/admin/properties
 * @access  Private (Admin only)
 */
export const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const properties = await Property.find()
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
 * @desc    Approve or Reject a property listing with optional rejection reason
 * @route   PUT /api/admin/properties/:id/verify
 * @access  Private (Admin only)
 */
export const verifyPropertyAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const validStatuses = ['approved', 'rejected', 'pending'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Verification status must be 'approved', 'rejected', or 'pending'",
      });
    }

    if (status === 'rejected' && (!rejectionReason || !rejectionReason.trim())) {
      return res.status(400).json({
        error: 'Please provide a clear rejection reason to help the host make necessary adjustments.',
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    property.verificationStatus = status;
    property.rejectionReason = status === 'rejected' ? rejectionReason.trim() : '';
    property.verifiedAt = status === 'approved' ? new Date() : undefined;

    await property.save();
    await property.populate('owner', 'name email role');

    return res.status(200).json({
      success: true,
      message: `Property ${status === 'approved' ? 'approved & verified' : 'status updated to ' + status} successfully`,
      property,
    });
  } catch (error) {
    next(error);
  }
};

