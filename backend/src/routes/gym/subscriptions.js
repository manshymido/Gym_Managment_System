import express from 'express';
import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  cancelSubscription
} from '../../controllers/gym/subscriptionController.js';
import { gymAuth } from '../../middleware/auth.js';
import { tenantIsolation } from '../../middleware/tenant.js';

const router = express.Router();

router.use(gymAuth);
router.use(tenantIsolation);

router.get('/', getAllSubscriptions);
router.get('/:id', getSubscriptionById);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', cancelSubscription);

export default router;

