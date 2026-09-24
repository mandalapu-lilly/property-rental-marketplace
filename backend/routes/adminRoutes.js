import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllPropertiesAdmin,
  verifyPropertyAdmin,
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/properties', getAllPropertiesAdmin);
router.put('/properties/:id/verify', verifyPropertyAdmin);

export default router;
