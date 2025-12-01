import express from 'express';
import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  cancelSubscription
} from '../../controllers/admin/subscriptionController.js';
import { adminAuth } from '../../middleware/auth.js';

const router = express.Router();

router.use(adminAuth);

router.get('/', getAllSubscriptions);
router.get('/:id', getSubscriptionById);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', cancelSubscription);

export default router;

