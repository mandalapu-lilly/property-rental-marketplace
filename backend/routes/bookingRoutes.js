import express from 'express';
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  rejectBooking,
  getAllBookings,
} from '../controllers/bookingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All booking actions require authentication

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/host', authorizeRoles('host', 'admin'), getHostBookings);
router.get('/', authorizeRoles('admin'), getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/confirm', authorizeRoles('host', 'admin'), confirmBooking);
router.put('/:id/reject', authorizeRoles('host', 'admin'), rejectBooking);

export default router;
