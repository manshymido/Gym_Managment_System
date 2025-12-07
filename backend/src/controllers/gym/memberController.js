import GymMember from '../../models/GymMember.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllMembers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', isActive = '' } = req.query;
  const skip = (page - 1) * limit;

  const query = { gymManager: req.gymManager._id };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }
  if (isActive !== '') {
    query.isActive = isActive === 'true';
  }

  const members = await GymMember.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await GymMember.countDocuments(query);

  res.json({
    members,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getMemberById = asyncHandler(async (req, res) => {
  const member = await GymMember.findOne({
    _id: req.params.id,
    gymManager: req.gymManager._id
  });

  if (!member) {
    const error = new Error('العضو غير موجود');
    error.status = 404;
    throw error;
  }

  res.json(member);
});

export const createMember = asyncHandler(async (req, res) => {
  const memberData = {
    ...req.body,
    gymManager: req.gymManager._id
  };

  const member = await GymMember.create(memberData);
  res.status(201).json({ message: 'تم إضافة العضو بنجاح', member });
});

export const updateMember = asyncHandler(async (req, res) => {
  const member = await GymMember.findOneAndUpdate(
    { _id: req.params.id, gymManager: req.gymManager._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!member) {
    const error = new Error('العضو غير موجود');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم التحديث بنجاح', member });
});

export const deleteMember = asyncHandler(async (req, res) => {
  const member = await GymMember.findOneAndDelete({
    _id: req.params.id,
    gymManager: req.gymManager._id
  });

  if (!member) {
    const error = new Error('العضو غير موجود');
    error.status = 404;
    throw error;
  }

  res.json({ message: 'تم الحذف بنجاح' });
});

