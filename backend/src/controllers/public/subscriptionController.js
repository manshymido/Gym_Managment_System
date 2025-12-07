import GymManager from '../../models/GymManager.js';
import GymManagerSubscription from '../../models/GymManagerSubscription.js';
import SubscriptionPlan from '../../models/SubscriptionPlan.js';
import Payment from '../../models/Payment.js';
import { generateToken } from '../../utils/jwt.js';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Subscribe from landing page
// This endpoint handles both registration and subscription in one flow
export const publicSubscribe = asyncHandler(async (req, res) => {
  const { 
    // Registration data (if new user)
    name,
    gymName,
    email,
    password,
    phone,
    address,
    // Subscription data
    planId,
    paymentMethod,
    paymentId,
    autoRenew
  } = req.body;

  // Validate required fields
  if (!planId) {
    const error = new Error('يجب اختيار باقة للاشتراك');
    error.status = 400;
    throw error;
  }

  // Verify plan exists and is active
  const plan = await SubscriptionPlan.findOne({ 
    _id: planId, 
    isActive: true 
  });
  
  if (!plan) {
    const error = new Error('الباقة غير موجودة أو غير نشطة');
    error.status = 404;
    throw error;
  }

  let gymManager;

  // Check if user is already registered (by email)
  if (email) {
    gymManager = await GymManager.findOne({ email });
    
    if (gymManager) {
      // User exists - just create subscription
      // Note: In a real scenario, you might want to verify password here
      // For now, we'll allow subscription if user exists
    } else {
      // New user - create account first
      if (!name || !gymName || !email || !password) {
        const error = new Error('يجب إدخال جميع البيانات المطلوبة للتسجيل');
        error.status = 400;
        throw error;
      }

      // Check if email already exists
      const existingManager = await GymManager.findOne({ email });
      if (existingManager) {
        const error = new Error('البريد الإلكتروني مستخدم بالفعل');
        error.status = 400;
        throw error;
      }

      // Create new gym manager
      gymManager = await GymManager.create({
        name,
        email,
        password,
        gymName,
        phone,
        address
      });
    }
  } else {
    const error = new Error('البريد الإلكتروني مطلوب');
    error.status = 400;
    throw error;
  }

  // Calculate subscription dates
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
    gymManager: gymManager._id,
    plan: planId,
    startDate,
    endDate,
    paymentMethod: paymentMethod || 'local',
    paymentId: paymentId || null,
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
    gymManager: gymManager._id,
    type: 'gym_manager_subscription',
    relatedId: subscription._id,
    amount: plan.price,
    paymentMethod: paymentMethod || 'local',
    paymentGatewayId: paymentId || null,
    status: 'completed',
    paidAt: new Date(),
    description: `اشتراك في باقة ${plan.name}`
  });

  // Generate token for the user
  const token = generateToken({ id: gymManager._id, type: 'gym_manager' });

  const populatedSubscription = await GymManagerSubscription.findById(subscription._id)
    .populate('plan')
    .select('-__v');

  res.status(201).json({ 
    success: true,
    message: 'تم الاشتراك بنجاح', 
    token,
    subscription: populatedSubscription,
    gymManager: {
      id: gymManager._id,
      name: gymManager.name,
      email: gymManager.email,
      gymName: gymManager.gymName,
      subscriptionStatus: gymManager.subscriptionStatus
    }
  });
});

