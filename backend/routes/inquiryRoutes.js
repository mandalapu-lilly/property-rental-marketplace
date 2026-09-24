import express from 'express';
import {
  createInquiry,
  getMyInquiries,
  getHostInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createInquiry);
router.get('/my', protect, getMyInquiries);
router.get('/host', protect, authorize('host', 'admin'), getHostInquiries);
router.patch('/:id/status', protect, authorize('host', 'admin'), updateInquiryStatus);

export default router;
