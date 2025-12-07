import GymManager from '../../models/GymManager.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllGymManagers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', status = '' } = req.query;
  const skip = (page - 1) * limit;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { gymName: { $regex: search, $options: 'i' } }
    ];
  }
  if (status) {
    query.subscriptionStatus = status;
  }

  const gymManagers = await GymManager.find(query)
    .select('-password')
    .populate({
      path: 'currentSubscription',
      populate: {
        path: 'plan',
        select: 'name price'
      }
    })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await GymManager.countDocuments(query);

  res.json({
    gymManagers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getGymManagerById = asyncHandler(async (req, res) => {
  const gymManager = await GymManager.findById(req.params.id)
    .select('-password')
    .populate({
      path: 'currentSubscription',
      populate: {
        path: 'plan',
        select: 'name price'
      }
    });

  if (!gymManager) {
    const error = new Error('مدير الجيم غير موجود');
    error.status = 404;
    throw error;
  }

  res.json(gymManager);
});

export const updateGymManager = asyncHandler(async (req, res) => {
  const { name, gymName, phone, address, isActive } = req.body;

  const gymManager = await GymManager.findByIdAndUpdate(
    req.params.id,
    { name, gymName, phone, address, isActive },
    { new: true, runValidators: true }
  ).select('-password');

  if (!gymManager) {
    const error = new Error('مدير الجيم غير موجود');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم التحديث بنجاح', gymManager });
});

export const deleteGymManager = asyncHandler(async (req, res) => {
  const gymManager = await GymManager.findByIdAndDelete(req.params.id);

  if (!gymManager) {
    const error = new Error('مدير الجيم غير موجود');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم الحذف بنجاح' });
});

