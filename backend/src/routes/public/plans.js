import express from 'express';
import {
  getPublicPlans,
  getPublicPlanById
} from '../../controllers/public/planController.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/', getPublicPlans);
router.get('/:id', getPublicPlanById);

export default router;

