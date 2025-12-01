import MemberPlan from '../../models/MemberPlan.js';

export const getAllPlans = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = { gymManager: req.gymManager._id };
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const plans = await MemberPlan.find(query).sort({ createdAt: -1 });
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await MemberPlan.findOne({
      _id: req.params.id,
      gymManager: req.gymManager._id
    });

    if (!plan) {
      return res.status(404).json({ message: 'الباقة غير موجودة' });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const createPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء الباقة', error: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await MemberPlan.findOneAndUpdate(
      { _id: req.params.id, gymManager: req.gymManager._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ message: 'الباقة غير موجودة' });
    }

    res.json({ message: 'تم التحديث بنجاح', plan });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التحديث', error: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await MemberPlan.findOneAndDelete({
      _id: req.params.id,
      gymManager: req.gymManager._id
    });

    if (!plan) {
      return res.status(404).json({ message: 'الباقة غير موجودة' });
    }

    res.json({ message: 'تم حذف الباقة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الحذف', error: error.message });
  }
};

