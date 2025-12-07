import Payment from '../../models/Payment.js';
import MemberSubscription from '../../models/MemberSubscription.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type = '', status = '', startDate, endDate } = req.query;
  const skip = (page - 1) * limit;

  const query = { gymManager: req.gymManager._id };
  if (type) query.type = type;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const payments = await Payment.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Payment.countDocuments(query);

  // Calculate totals - exclude gym_manager_subscription payments (these are admin revenue, not gym manager revenue)
  const revenueQuery = { 
    ...query, 
    status: 'completed',
    type: { $ne: 'gym_manager_subscription' } // Only count member_subscription payments as gym manager revenue
  };
  const totalAmount = await Payment.aggregate([
    { $match: revenueQuery },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.json({
    payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    totalAmount: totalAmount[0]?.total || 0
  });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({
    _id: req.params.id,
    gymManager: req.gymManager._id
  });

  if (!payment) {
    const error = new Error('الدفعة غير موجودة');
    error.status = 404;
    throw error;
  }

  res.json(payment);
});

export const createPayment = asyncHandler(async (req, res) => {
  const { type, relatedId, amount, paymentMethod, paymentGatewayId, description } = req.body;

  // Verify related subscription exists if type is member_subscription
  if (type === 'member_subscription') {
    const subscription = await MemberSubscription.findOne({
      _id: relatedId,
      gymManager: req.gymManager._id
    });

    if (!subscription) {
      const error = new Error('الاشتراك غير موجود');
      error.status = 404;
      throw error;
    }
  }

  const payment = await Payment.create({
    gymManager: req.gymManager._id,
    type,
    relatedId,
    amount,
    paymentMethod,
    paymentGatewayId,
    status: 'completed',
    paidAt: new Date(),
    description
  });

  res.status(201).json({ message: 'تم تسجيل الدفعة بنجاح', payment });
});

export const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.id, gymManager: req.gymManager._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!payment) {
    const error = new Error('الدفعة غير موجودة');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم التحديث بنجاح', payment });
});

