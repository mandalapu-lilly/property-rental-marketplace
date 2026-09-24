import express from 'express';
import {
  getFavorites,
  checkFavorite,
  addFavorite,
  removeFavorite,
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All favorites routes require authentication

router.get('/', getFavorites);
router.get('/check/:propertyId', checkFavorite);
router.post('/:propertyId', addFavorite);
router.delete('/:propertyId', removeFavorite);

export default router;
