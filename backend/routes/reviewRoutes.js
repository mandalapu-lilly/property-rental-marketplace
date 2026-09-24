import express from 'express';
import {
  updateReview,
  deleteReview,
  getAllReviews,
} from '../controllers/reviewController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorizeRoles('admin'), getAllReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
