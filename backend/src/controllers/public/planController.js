import SubscriptionPlan from '../../models/SubscriptionPlan.js';

// Get all active plans (public endpoint - no auth required)
export const getPublicPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ price: 1 })
      .select('-__v');
    
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'خطأ في جلب البيانات', 
      error: error.message 
    });
  }
};

// Get plan by ID (public endpoint - no auth required)
export const getPublicPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).select('-__v');

    if (!plan) {
      return res.status(404).json({ 
        success: false,
        message: 'الباقة غير موجودة أو غير نشطة' 
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'خطأ في جلب البيانات', 
      error: error.message 
    });
  }
};

