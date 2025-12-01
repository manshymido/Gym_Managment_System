import express from 'express';
import paymentService from '../../services/paymentService.js';
import { adminAuth, gymAuth } from '../../middleware/auth.js';

const router = express.Router();

// Admin can process payments for gym manager subscriptions
router.post('/create-intent', adminAuth, async (req, res) => {
  try {
    const { amount, currency = 'usd', description } = req.body;

    const result = await paymentService.processStripePayment(amount, currency, description);

    if (result.success) {
      res.json({
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId
      });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطأ في معالجة الدفع', error: error.message });
  }
});

router.post('/confirm', adminAuth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const result = await paymentService.confirmStripePayment(paymentIntentId);

    if (result.success) {
      res.json({ message: 'تم تأكيد الدفع بنجاح', payment: result.paymentIntent });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تأكيد الدفع', error: error.message });
  }
});

export default router;

