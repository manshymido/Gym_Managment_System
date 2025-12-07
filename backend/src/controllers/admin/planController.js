import SubscriptionPlan from '../../models/SubscriptionPlan.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllPlans = asyncHandler(async (req, res) => {
  const { isActive } = req.query;
  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const plans = await SubscriptionPlan.find(query).sort({ price: 1 });
  res.json(plans);
});

export const getPlanById = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.params.id);

  if (!plan) {
    const error = new Error('الباقة غير موجودة');
    error.status = 404;
    throw error;
  }

  res.json(plan);
});

export const createPlan = asyncHandler(async (req, res) => {
  const { name, description, price, duration, durationUnit, features, maxMembers } = req.body;

  const plan = await SubscriptionPlan.create({
    name,
    description,
    price,
    duration,
    durationUnit,
    features: features || [],
    maxMembers: maxMembers || -1
  });

  res.status(201).json({ message: 'تم إنشاء الباقة بنجاح', plan });
});

export const updatePlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!plan) {
    const error = new Error('الباقة غير موجودة');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم التحديث بنجاح', plan });
});

export const deletePlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);

  if (!plan) {
    const error = new Error('الباقة غير موجودة');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم الحذف بنجاح' });
});

