import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { createNotification } from '../services/notificationService.js';

/**
 * @desc    Create a review for a property
 * @route   POST /api/properties/:propertyId/reviews
 * @access  Private
 */
export const createReview = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { rating, comment, bookingId } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Please provide both rating and review comment' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }

    if (!comment.trim() || comment.trim().length < 5) {
      return res.status(400).json({ error: 'Review comment must be at least 5 characters long' });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user has a verified booking for this property
    const verifiedBooking = await Booking.findOne({
      property: propertyId,
      user: req.user._id,
      status: { $in: ['confirmed', 'completed'] },
    });

    if (!verifiedBooking && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'You can only review properties where you have a confirmed or completed booking stay',
      });
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existingReview) {
      return res.status(409).json({
        error: 'You have already submitted a review for this property. You can edit your existing review.',
      });
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      booking: verifiedBooking?._id || bookingId,
      rating: numRating,
      comment: comment.trim(),
    });

    await review.populate('user', 'name role');

    // Notify host non-blockingly
    if (property.owner) {
      createNotification({
        recipient: property.owner,
        sender: req.user._id,
        type: 'new_review',
        title: 'New Review Received',
        message: `Your property "${property.title}" received a new ${numRating}★ review from ${req.user.name || 'a guest'}.`,
        relatedEntityId: property._id,
        relatedEntityType: 'Property',
        link: `/properties/${property._id}`,
      });
    }

    return res.status(201).json({
      message: 'Review posted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews for a specific property
 * @route   GET /api/properties/:propertyId/reviews
 * @access  Public
 */
export const getPropertyReviews = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const reviews = await Review.find({ property: propertyId })
      .populate('user', 'name role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private (Author or Admin)
 */
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const isAuthor = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own reviews' });
    }

    if (rating !== undefined) {
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      review.rating = numRating;
    }

    if (comment !== undefined) {
      if (!comment.trim() || comment.trim().length < 5) {
        return res.status(400).json({ error: 'Review comment must be at least 5 characters' });
      }
      review.comment = comment.trim();
    }

    await review.save();
    await review.populate('user', 'name role');

    return res.status(200).json({
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Author or Admin)
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const isAuthor = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own reviews' });
    }

    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews (Admin only)
 * @route   GET /api/reviews
 * @access  Private (Admin only)
 */
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email role')
      .populate('property', 'title location city')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
