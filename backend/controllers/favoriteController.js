import mongoose from 'mongoose';
import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';

/**
 * @desc    Get all favorites of the authenticated user
 * @route   GET /api/favorites
 * @access  Private
 */
export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email role' },
      })
      .sort({ createdAt: -1 });

    // Filter out any favorites where property might have been deleted
    const validFavorites = favorites.filter((fav) => fav.property !== null);

    return res.status(200).json({
      success: true,
      count: validFavorites.length,
      favorites: validFavorites,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if a property is in user's favorites
 * @route   GET /api/favorites/check/:propertyId
 * @access  Private
 */
export const checkFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const favorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    return res.status(200).json({
      isFavorite: !!favorite,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add property to favorites
 * @route   POST /api/favorites/:propertyId
 * @access  Private
 */
export const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const existing = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existing) {
      return res.status(409).json({
        error: 'Property is already in your favorites',
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
    });

    return res.status(201).json({
      message: 'Property added to favorites',
      favorite,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove property from favorites
 * @route   DELETE /api/favorites/:propertyId
 * @access  Private
 */
export const removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const result = await Favorite.findOneAndDelete({
      user: req.user._id,
      property: propertyId,
    });

    if (!result) {
      return res.status(404).json({
        error: 'Property not found in your favorites',
      });
    }

    return res.status(200).json({
      message: 'Property removed from favorites',
    });
  } catch (error) {
    next(error);
  }
};
