import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';

const router = express.Router();

// GET /api/recommendations
router.get('/', getRecommendations);

export default router;
