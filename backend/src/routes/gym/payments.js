import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment
} from '../../controllers/gym/paymentController.js';
import { gymAuth } from '../../middleware/auth.js';
import { tenantIsolation } from '../../middleware/tenant.js';

const router = express.Router();

router.use(gymAuth);
router.use(tenantIsolation);

router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.post('/', createPayment);
router.put('/:id', updatePayment);

export default router;

