import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateRecommendations } from '../services/recommendationEngine.js';

/**
 * @desc    Get AI property recommendations based on user history and preferences
 * @route   GET /api/recommendations
 * @access  Public (Enhanced if authenticated with Bearer token)
 */
export const getRecommendations = async (req, res, next) => {
  try {
    let userId = null;

    // Optional authentication extraction without blocking unauthenticated users
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const secret = process.env.JWT_SECRET || 'fallback_development_secret_key_change_in_production';
          const decoded = jwt.verify(token, secret);
          if (decoded && decoded.id) {
            userId = decoded.id;
          }
        } catch {
          // Token invalid/expired - continue gracefully as anonymous guest
        }
      }
    }

    const { city, propertyType, maxPrice, minPrice, bedrooms, amenities, limit } = req.query;

    const result = await generateRecommendations({
      userId,
      preferences: {
        city,
        propertyType,
        maxPrice,
        minPrice,
        bedrooms,
        amenities,
      },
    });

    const maxItems = limit ? parseInt(limit, 10) : 20;
    const finalRecommendations = result.recommendations.slice(0, maxItems);

    return res.status(200).json({
      success: true,
      count: finalRecommendations.length,
      profileApplied: result.profileApplied,
      recommendations: finalRecommendations,
    });
  } catch (error) {
    next(error);
  }
};
