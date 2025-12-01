import Payment from '../../models/Payment.js';
import GymManager from '../../models/GymManager.js';

export const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, type = '', status = '', startDate, endDate, gymManagerId } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (gymManagerId) query.gymManager = gymManagerId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('gymManager', 'name email gymName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);

    // Calculate totals for gym_manager_subscription payments (revenue)
    const revenueQuery = { ...query, type: 'gym_manager_subscription', status: 'completed' };
    const totalRevenue = await Payment.aggregate([
      { $match: revenueQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('gymManager', 'name email gymName');

    if (!payment) {
      return res.status(404).json({ message: 'الدفعة غير موجودة' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { type: 'gym_manager_subscription', status: 'completed' };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const totalRevenue = await Payment.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const revenueByMethod = await Payment.aggregate([
      { $match: query },
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const revenueByMonth = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueByMethod,
      revenueByMonth,
      totalPayments: await Payment.countDocuments(query)
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الإحصائيات', error: error.message });
  }
};

