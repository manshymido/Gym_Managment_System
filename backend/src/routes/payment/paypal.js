import express from 'express';
import paymentService from '../../services/paymentService.js';
import { adminAuth } from '../../middleware/auth.js';

const router = express.Router();

router.post('/create', adminAuth, async (req, res) => {
  try {
    const { amount, currency = 'USD', description } = req.body;

    const result = await paymentService.processPayPalPayment(amount, currency, description);

    if (result.success) {
      res.json({
        paymentId: result.paymentId,
        approvalUrl: result.approvalUrl
      });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطأ في معالجة الدفع', error: error.message });
  }
});

router.post('/execute', adminAuth, async (req, res) => {
  try {
    const { paymentId, payerId } = req.body;

    const result = await paymentService.confirmPayPalPayment(paymentId, payerId);

    if (result.success) {
      res.json({ message: 'تم تأكيد الدفع بنجاح', payment: result.payment });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تأكيد الدفع', error: error.message });
  }
});

export default router;

