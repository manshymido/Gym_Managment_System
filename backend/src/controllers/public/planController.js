import SubscriptionPlan from '../../models/SubscriptionPlan.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// Get all active plans (public endpoint - no auth required)
export const getPublicPlans = asyncHandler(async (req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true })
    .sort({ price: 1 })
    .select('-__v');
  
  res.json({
    success: true,
    data: plans
  });
});

// Get plan by ID (public endpoint - no auth required)
export const getPublicPlanById = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findOne({ 
    _id: req.params.id, 
    isActive: true 
  }).select('-__v');

  if (!plan) {
    const error = new Error('الباقة غير موجودة أو غير نشطة');
    error.status = 404;
    throw error;
  }

  res.json({
    success: true,
    data: plan
  });
});

