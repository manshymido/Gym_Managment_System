import Report from '../../models/Report.js';
import GymMember from '../../models/GymMember.js';
import MemberSubscription from '../../models/MemberSubscription.js';
import Payment from '../../models/Payment.js';
import Attendance from '../../models/Attendance.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const generateRevenueReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {
    gymManager: req.gymManager._id,
    status: 'completed',
    type: { $ne: 'gym_manager_subscription' } // Exclude gym manager subscription payments (admin revenue)
  };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const payments = await Payment.find(query);
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const revenueByMethod = await Payment.aggregate([
    { $match: query },
    { $group: { _id: '$paymentMethod', total: { $sum: '$amount' } } }
  ]);

  const revenueByType = await Payment.aggregate([
    { $match: query },
    { $group: { _id: '$type', total: { $sum: '$amount' } } }
  ]);

  const reportData = {
    totalRevenue,
    revenueByMethod,
    revenueByType,
    totalPayments: payments.length,
    period: { startDate, endDate }
  };

  // Save report
  const report = await Report.create({
    gymManager: req.gymManager._id,
    type: 'revenue',
    title: 'تقرير الإيرادات',
    data: reportData,
    period: {
      start: startDate ? new Date(startDate) : null,
      end: endDate ? new Date(endDate) : null
    }
  });

  res.json({ report, data: reportData });
});

export const generateMembersReport = asyncHandler(async (req, res) => {
  const totalMembers = await GymMember.countDocuments({
    gymManager: req.gymManager._id
  });

  const activeMembers = await GymMember.countDocuments({
    gymManager: req.gymManager._id,
    isActive: true
  });

  const totalSubscriptions = await MemberSubscription.countDocuments({
    gymManager: req.gymManager._id
  });

  const activeSubscriptions = await MemberSubscription.countDocuments({
    gymManager: req.gymManager._id,
    status: 'active',
    endDate: { $gte: new Date() }
  });

  const reportData = {
    totalMembers,
    activeMembers,
    inactiveMembers: totalMembers - activeMembers,
    totalSubscriptions,
    activeSubscriptions,
    expiredSubscriptions: totalSubscriptions - activeSubscriptions
  };

  const report = await Report.create({
    gymManager: req.gymManager._id,
    type: 'members',
    title: 'تقرير الأعضاء',
    data: reportData
  });

  res.json({ report, data: reportData });
});

export const generateAttendanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {
    gymManager: req.gymManager._id
  };

  if (startDate || endDate) {
    query.checkIn = {};
    if (startDate) query.checkIn.$gte = new Date(startDate);
    if (endDate) query.checkIn.$lte = new Date(endDate);
  }

  const totalCheckIns = await Attendance.countDocuments(query);

  const attendanceByMember = await Attendance.aggregate([
    { $match: query },
    { $group: { _id: '$member', count: { $sum: 1 } } },
    { $lookup: { from: 'gymmembers', localField: '_id', foreignField: '_id', as: 'member' } },
    { $unwind: '$member' },
    { $project: { memberName: '$member.name', count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const dailyAttendance = await Attendance.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$checkIn' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const reportData = {
    totalCheckIns,
    attendanceByMember,
    dailyAttendance
  };

  const report = await Report.create({
    gymManager: req.gymManager._id,
    type: 'attendance',
    title: 'تقرير الحضور',
    data: reportData,
    period: {
      start: startDate ? new Date(startDate) : null,
      end: endDate ? new Date(endDate) : null
    }
  });

  res.json({ report, data: reportData });
});

export const getAllReports = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const query = { gymManager: req.gymManager._id };
  if (type) query.type = type;

  const reports = await Report.find(query)
    .sort({ generatedAt: -1 })
    .limit(50);

  res.json({ reports });
});

export const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findOne({
    _id: req.params.id,
    gymManager: req.gymManager._id
  });

  if (!report) {
    const error = new Error('التقرير غير موجود');
    error.status = 404;
    throw error;
  }

  res.json(report);
});

