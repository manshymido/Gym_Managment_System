import MemberPlan from '../../models/MemberPlan.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllPlans = asyncHandler(async (req, res) => {
  const { isActive } = req.query;
  const query = { gymManager: req.gymManager._id };
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const plans = await MemberPlan.find(query).sort({ createdAt: -1 });
  res.json({ plans });
});

export const getPlanById = asyncHandler(async (req, res) => {
  const plan = await MemberPlan.findOne({
    _id: req.params.id,
    gymManager: req.gymManager._id
  });

  if (!plan) {
    const error = new Error('الباقة غير موجودة');
    error.status = 404;
    throw error;
  }

  res.json(plan);
});

export const createPlan = asyncHandler(async (req, res) => {
  const { name, description, price, duration, durationUnit, features } = req.body;

  const plan = await MemberPlan.create({
    gymManager: req.gymManager._id,
    name,
    description,
    price,
    duration,
    durationUnit: durationUnit || 'months',
    features: features || []
  });

  res.status(201).json({ message: 'تم إنشاء الباقة بنجاح', plan });
});

export const updatePlan = asyncHandler(async (req, res) => {
  const plan = await MemberPlan.findOneAndUpdate(
    { _id: req.params.id, gymManager: req.gymManager._id },
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
  const plan = await MemberPlan.findOneAndDelete({
    _id: req.params.id,
    gymManager: req.gymManager._id
  });

  if (!plan) {
    const error = new Error('الباقة غير موجودة');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم حذف الباقة بنجاح' });
});

