import MemberSubscription from '../../models/MemberSubscription.js';
import MemberPlan from '../../models/MemberPlan.js';
import GymMember from '../../models/GymMember.js';
import Payment from '../../models/Payment.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllSubscriptions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status = '', memberId = '' } = req.query;
  const skip = (page - 1) * limit;

  const query = { gymManager: req.gymManager._id };
  if (status) query.status = status;
  if (memberId) query.member = memberId;

  const subscriptions = await MemberSubscription.find(query)
    .populate('member', 'name phone email')
    .populate('plan', 'name price duration durationUnit')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await MemberSubscription.countDocuments(query);

  res.json({
    subscriptions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getSubscriptionById = asyncHandler(async (req, res) => {
  const subscription = await MemberSubscription.findOne({
    _id: req.params.id,
    gymManager: req.gymManager._id
  })
    .populate('member')
    .populate('plan');

  if (!subscription) {
    const error = new Error('الاشتراك غير موجود');
    error.status = 404;
    throw error;
  }

  res.json(subscription);
});

export const createSubscription = asyncHandler(async (req, res) => {
  const { memberId, planId, planName, price, duration, paymentMethod, autoRenew } = req.body;

  // Verify member exists and belongs to this gym manager
  const member = await GymMember.findOne({
    _id: memberId,
    gymManager: req.gymManager._id
  });

  if (!member) {
    const error = new Error('العضو غير موجود');
    error.status = 404;
    throw error;
  }

  let plan = null;
  let subscriptionPrice = 0;
  let subscriptionDuration = 1;
  let subscriptionDurationUnit = 'months';
  let subscriptionPlanName = '';

  // If planId is provided, use it; otherwise fall back to manual entry
  if (planId) {
    plan = await MemberPlan.findOne({
      _id: planId,
      gymManager: req.gymManager._id,
      isActive: true
    });

    if (!plan) {
      const error = new Error('الباقة غير موجودة أو غير نشطة');
      error.status = 404;
      throw error;
    }

    subscriptionPrice = plan.price;
    subscriptionDuration = plan.duration;
    subscriptionDurationUnit = plan.durationUnit;
    subscriptionPlanName = plan.name;
  } else {
    // Fallback to manual entry for backward compatibility
    if (!planName || !price || !duration) {
      const error = new Error('يجب إدخال بيانات الباقة أو اختيار باقة موجودة');
      error.status = 400;
      throw error;
    }
    subscriptionPrice = parseFloat(price);
    subscriptionDuration = parseInt(duration);
    subscriptionPlanName = planName;
  }

  // Calculate dates
  const startDate = new Date();
  const endDate = new Date();
  
  if (plan && plan.durationUnit === 'days') {
    endDate.setDate(endDate.getDate() + subscriptionDuration);
  } else if (plan && plan.durationUnit === 'years') {
    endDate.setFullYear(endDate.getFullYear() + subscriptionDuration);
  } else {
    // Default to months
    endDate.setMonth(endDate.getMonth() + subscriptionDuration);
  }

  const subscription = await MemberSubscription.create({
    gymManager: req.gymManager._id,
    member: memberId,
    plan: planId || null,
    planName: subscriptionPlanName,
    price: subscriptionPrice,
    startDate,
    endDate,
    paymentMethod: paymentMethod || 'cash',
    autoRenew: autoRenew || false,
    status: 'active'
  });

  // Create payment record automatically
  await Payment.create({
    gymManager: req.gymManager._id,
    type: 'member_subscription',
    relatedId: subscription._id,
    amount: subscriptionPrice,
    paymentMethod: paymentMethod || 'cash',
    status: 'completed',
    paidAt: new Date(),
    description: `اشتراك عضو في باقة ${subscriptionPlanName}`
  });

  const populatedSubscription = await MemberSubscription.findById(subscription._id)
    .populate('member')
    .populate('plan');

  res.status(201).json({ message: 'تم إنشاء الاشتراك بنجاح', subscription: populatedSubscription });
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await MemberSubscription.findOneAndUpdate(
    { _id: req.params.id, gymManager: req.gymManager._id },
    req.body,
    { new: true, runValidators: true }
  )
    .populate('member')
    .populate('plan');

  if (!subscription) {
    const error = new Error('الاشتراك غير موجود');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم التحديث بنجاح', subscription });
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await MemberSubscription.findOneAndUpdate(
    { _id: req.params.id, gymManager: req.gymManager._id },
    { status: 'cancelled' },
    { new: true }
  );

  if (!subscription) {
    const error = new Error('الاشتراك غير موجود');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم إلغاء الاشتراك بنجاح' });
});

