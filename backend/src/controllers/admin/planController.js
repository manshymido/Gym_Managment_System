import SubscriptionPlan from '../../models/SubscriptionPlan.js';

export const getAllPlans = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const plans = await SubscriptionPlan.find(query).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);

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
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء الباقة', error: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
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
    const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'الباقة غير موجودة' });
    }

    res.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الحذف', error: error.message });
  }
};

