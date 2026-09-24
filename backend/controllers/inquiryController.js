import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Submit a new property inquiry to host
 * @route   POST /api/inquiries
 * @access  Private
 */
export const createInquiry = async (req, res, next) => {
  try {
    const { propertyId, message, phone, preferredMoveInDate } = req.body;

    if (!propertyId || !message || !message.trim()) {
      return res.status(400).json({ error: 'Property ID and message are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot send an inquiry on your own property listing' });
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      sender: req.user._id,
      host: property.owner,
      message: message.trim(),
      phone: phone ? phone.trim() : '',
      preferredMoveInDate: preferredMoveInDate ? new Date(preferredMoveInDate) : undefined,
      status: 'unread',
    });

    await inquiry.populate([
      { path: 'property', select: 'title location city price images' },
      { path: 'sender', select: 'name email' },
      { path: 'host', select: 'name email' },
    ]);

    // Asynchronously notify host via existing Notification Service
    createNotification({
      recipient: property.owner,
      sender: req.user._id,
      type: 'system',
      title: 'New Property Inquiry',
      message: `${req.user.name || 'A prospective tenant'} sent an inquiry regarding "${property.title}".`,
      relatedEntityId: property._id,
      relatedEntityType: 'Property',
      link: `/properties/${property._id}`,
    });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been sent to the host successfully.',
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's sent inquiries
 * @route   GET /api/inquiries/my
 * @access  Private
 */
export const getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.user._id })
      .populate('property', 'title location city price images')
      .populate('host', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get host's received property inquiries
 * @route   GET /api/inquiries/host
 * @access  Private (Host or Admin only)
 */
export const getHostInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ host: req.user._id })
      .populate('property', 'title location city price images')
      .populate('sender', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark inquiry as read or replied
 * @route   PATCH /api/inquiries/:id/status
 * @access  Private (Host only)
 */
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (inquiry.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this inquiry' });
    }

    if (['unread', 'read', 'replied'].includes(status)) {
      inquiry.status = status;
      await inquiry.save();
    }

    return res.status(200).json({
      success: true,
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};
