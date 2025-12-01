import express from 'express';
import paymentService from '../../services/paymentService.js';
import { adminAuth, gymAuth } from '../../middleware/auth.js';

const router = express.Router();

router.post('/process', adminAuth, async (req, res) => {
  try {
    const { amount, paymentMethod, description } = req.body;

    const result = await paymentService.processLocalPayment(amount, paymentMethod, description);

    if (result.success) {
      res.json({
        message: 'تم تسجيل الدفعة بنجاح',
        paymentId: result.paymentId
      });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطأ في معالجة الدفع', error: error.message });
  }
});

export default router;

