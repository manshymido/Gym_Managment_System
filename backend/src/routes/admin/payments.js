import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  getRevenueStats
} from '../../controllers/admin/paymentController.js';
import { adminAuth } from '../../middleware/auth.js';

const router = express.Router();

router.use(adminAuth);

router.get('/', getAllPayments);
router.get('/stats', getRevenueStats);
router.get('/:id', getPaymentById);

export default router;

