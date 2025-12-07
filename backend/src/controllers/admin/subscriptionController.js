import GymManagerSubscription from '../../models/GymManagerSubscription.js';
import GymManager from '../../models/GymManager.js';
import SubscriptionPlan from '../../models/SubscriptionPlan.js';
import Payment from '../../models/Payment.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllSubscriptions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status = '', gymManagerId = '' } = req.query;
  const skip = (page - 1) * limit;

  const query = {};
  if (status) query.status = status;
  if (gymManagerId) query.gymManager = gymManagerId;

  const subscriptions = await GymManagerSubscription.find(query)
    .populate('gymManager', 'name email gymName')
    .populate('plan')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await GymManagerSubscription.countDocuments(query);

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
  const subscription = await GymManagerSubscription.findById(req.params.id)
    .populate('gymManager')
    .populate('plan');

  if (!subscription) {
    const error = new Error('الاشتراك غير موجود');
    error.status = 404;
    throw error;
  }

  res.json(subscription);
});

export const createSubscription = asyncHandler(async (req, res) => {
  const { gymManagerId, planId, paymentMethod, paymentId, autoRenew } = req.body;

  // Verify gym manager exists
  const gymManager = await GymManager.findById(gymManagerId);
  if (!gymManager) {
    const error = new Error('مدير الجيم غير موجود');
    error.status = 404;
    throw error;
  }

  // Verify plan exists
  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) {
    const error = new Error('الباقة غير موجودة');
    error.status = 404;
    throw error;
  }

  // Calculate dates
  const startDate = new Date();
  const endDate = new Date();
  if (plan.durationUnit === 'days') {
    endDate.setDate(endDate.getDate() + plan.duration);
  } else if (plan.durationUnit === 'months') {
    endDate.setMonth(endDate.getMonth() + plan.duration);
  } else if (plan.durationUnit === 'years') {
    endDate.setFullYear(endDate.getFullYear() + plan.duration);
  }

  // Create subscription
  const subscription = await GymManagerSubscription.create({
    gymManager: gymManagerId,
    plan: planId,
    startDate,
    endDate,
    paymentMethod,
    paymentId,
    amount: plan.price,
    autoRenew: autoRenew || false,
    status: 'active'
  });

  // Update gym manager
  gymManager.currentSubscription = subscription._id;
  gymManager.subscriptionStatus = 'active';
  await gymManager.save();

  // Create payment record
  await Payment.create({
    gymManager: gymManagerId,
    type: 'gym_manager_subscription',
    relatedId: subscription._id,
    amount: plan.price,
    paymentMethod,
    paymentGatewayId: paymentId,
    status: 'completed',
    paidAt: new Date(),
    description: `اشتراك في باقة ${plan.name}`
  });

  const populatedSubscription = await GymManagerSubscription.findById(subscription._id)
    .populate('gymManager')
    .populate('plan');

  res.status(201).json({ message: 'تم إنشاء الاشتراك بنجاح', subscription: populatedSubscription });
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await GymManagerSubscription.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('gymManager').populate('plan');

  if (!subscription) {
    const error = new Error('الاشتراك غير موجود');
    error.status = 404;
    throw error;
  }

  // Update gym manager status if subscription status changed
  if (req.body.status) {
    const gymManager = await GymManager.findById(subscription.gymManager._id);
    if (gymManager) {
      gymManager.subscriptionStatus = req.body.status;
      await gymManager.save();
    }
  }

  res.json({ message: 'تم التحديث بنجاح', subscription });
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await GymManagerSubscription.findById(req.params.id);

  if (!subscription) {
    const error = new Error('الاشتراك غير موجود');
    error.status = 404;
    throw error;
  }

  subscription.status = 'cancelled';
  await subscription.save();

  // Update gym manager
  const gymManager = await GymManager.findById(subscription.gymManager);
  if (gymManager) {
    gymManager.subscriptionStatus = 'cancelled';
    await gymManager.save();
  }

  res.json({ message: 'تم إلغاء الاشتراك بنجاح' });
});

