import express from 'express';
import {
  createProperty,
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  getSimilarProperties,
  getMyProperties,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import {
  createReview,
  getPropertyReviews,
} from '../controllers/reviewController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);

// Authenticated user routes (Placed BEFORE /:id to prevent route shadowing)
router.get('/my', protect, getMyProperties);

// Specific property routes
router.get('/:id', getPropertyById);
router.get('/:id/similar', getSimilarProperties);

// Review subroutes for property
router.get('/:propertyId/reviews', getPropertyReviews);
router.post('/:propertyId/reviews', protect, createReview);

// Host/Admin property creation route
router.post('/', protect, authorizeRoles('host', 'admin'), createProperty);

// Owner/Admin update and delete routes
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;
