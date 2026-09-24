import express from 'express';
import { getHostStats } from '../controllers/hostController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('host', 'admin'));

router.get('/stats', getHostStats);

export default router;
