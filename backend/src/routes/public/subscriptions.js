import express from 'express';
import { publicSubscribe } from '../../controllers/public/subscriptionController.js';

const router = express.Router();

// Public route - no authentication required
router.post('/', publicSubscribe);

export default router;

