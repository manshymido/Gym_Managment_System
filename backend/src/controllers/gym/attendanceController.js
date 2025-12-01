import Attendance from '../../models/Attendance.js';
import GymMember from '../../models/GymMember.js';
import MemberSubscription from '../../models/MemberSubscription.js';

export const getAllAttendance = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const { memberId, notes } = req.body;

    // Verify member exists and belongs to this gym manager
    const member = await GymMember.findOne({
      _id: memberId,
      gymManager: req.gymManager._id,
      isActive: true
    });

    if (!member) {
      return res.status(404).json({ message: 'العضو غير موجود أو غير نشط' });
    }

    // Check if member has active subscription
    const activeSubscription = await MemberSubscription.findOne({
      member: memberId,
      gymManager: req.gymManager._id,
      status: 'active',
      endDate: { $gte: new Date() }
    });

    if (!activeSubscription) {
      return res.status(403).json({ message: 'العضو ليس لديه اشتراك نشط' });
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
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تسجيل الحضور', error: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      _id: req.params.id,
      gymManager: req.gymManager._id,
      checkOut: null
    });

    if (!attendance) {
      return res.status(404).json({ message: 'سجل الحضور غير موجود أو تم تسجيل الخروج بالفعل' });
    }

    const checkOutTime = new Date();
    const duration = Math.floor((checkOutTime - attendance.checkIn) / 60000); // in minutes

    attendance.checkOut = checkOutTime;
    attendance.duration = duration;
    await attendance.save();

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('member', 'name phone');

    res.json({ message: 'تم تسجيل الخروج بنجاح', attendance: populatedAttendance });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تسجيل الخروج', error: error.message });
  }
};

export const getMemberAttendance = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

