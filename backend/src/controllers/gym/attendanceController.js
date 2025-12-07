import Attendance from '../../models/Attendance.js';
import GymMember from '../../models/GymMember.js';
import MemberSubscription from '../../models/MemberSubscription.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const getAllAttendance = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, memberId = '', startDate, endDate } = req.query;
  const skip = (page - 1) * limit;

  const query = { gymManager: req.gymManager._id };
  if (memberId) query.member = memberId;
  if (startDate || endDate) {
    query.checkIn = {};
    if (startDate) query.checkIn.$gte = new Date(startDate);
    if (endDate) query.checkIn.$lte = new Date(endDate);
  }

  const attendance = await Attendance.find(query)
    .populate('member', 'name phone')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ checkIn: -1 });

  const total = await Attendance.countDocuments(query);

  res.json({
    attendance,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const checkIn = asyncHandler(async (req, res) => {
  const { memberId, notes } = req.body;

  // Verify member exists and belongs to this gym manager
  const member = await GymMember.findOne({
    _id: memberId,
    gymManager: req.gymManager._id,
    isActive: true
  });

  if (!member) {
    const error = new Error('العضو غير موجود أو غير نشط');
    error.status = 404;
    throw error;
  }

  // Check if member has active subscription
  const activeSubscription = await MemberSubscription.findOne({
    member: memberId,
    gymManager: req.gymManager._id,
    status: 'active',
    endDate: { $gte: new Date() }
  });

  if (!activeSubscription) {
    const error = new Error('العضو ليس لديه اشتراك نشط');
    error.status = 403;
    throw error;
  }

  // Create attendance record
  const attendance = await Attendance.create({
    gymManager: req.gymManager._id,
    member: memberId,
    checkIn: new Date(),
    notes
  });

  const populatedAttendance = await Attendance.findById(attendance._id)
    .populate('member', 'name phone');

  res.status(201).json({ message: 'تم تسجيل الحضور بنجاح', attendance: populatedAttendance });
});

export const checkOut = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findOne({
    _id: req.params.id,
    gymManager: req.gymManager._id,
    checkOut: null
  });

  if (!attendance) {
    const error = new Error('سجل الحضور غير موجود أو تم تسجيل الخروج بالفعل');
    error.status = 404;
    throw error;
  }

  const checkOutTime = new Date();
  const duration = Math.floor((checkOutTime - attendance.checkIn) / 60000); // in minutes

  attendance.checkOut = checkOutTime;
  attendance.duration = duration;
  await attendance.save();

  const populatedAttendance = await Attendance.findById(attendance._id)
    .populate('member', 'name phone');

  res.json({ message: 'تم تسجيل الخروج بنجاح', attendance: populatedAttendance });
});

export const getMemberAttendance = asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  const { startDate, endDate } = req.query;

  const query = {
    gymManager: req.gymManager._id,
    member: memberId
  };

  if (startDate || endDate) {
    query.checkIn = {};
    if (startDate) query.checkIn.$gte = new Date(startDate);
    if (endDate) query.checkIn.$lte = new Date(endDate);
  }

  const attendance = await Attendance.find(query)
    .sort({ checkIn: -1 });

  res.json({ attendance });
});

