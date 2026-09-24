import express from 'express';
import {
  createInquiry,
  getMyInquiries,
  getHostInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createInquiry);
router.get('/my', protect, getMyInquiries);
router.get('/host', protect, authorizeRoles('host', 'admin'), getHostInquiries);
router.patch('/:id/status', protect, authorizeRoles('host', 'admin'), updateInquiryStatus);

export default router;
