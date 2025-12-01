import GymManager from '../../models/GymManager.js';

export const getAllGymManagers = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const getGymManagerById = async (req, res) => {
  try {
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
      return res.status(404).json({ message: 'مدير الجيم غير موجود' });
    }

    res.json(gymManager);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const updateGymManager = async (req, res) => {
  try {
    const { name, gymName, phone, address, isActive } = req.body;

    const gymManager = await GymManager.findByIdAndUpdate(
      req.params.id,
      { name, gymName, phone, address, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!gymManager) {
      return res.status(404).json({ message: 'مدير الجيم غير موجود' });
    }

    res.json({ message: 'تم التحديث بنجاح', gymManager });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التحديث', error: error.message });
  }
};

export const deleteGymManager = async (req, res) => {
  try {
    const gymManager = await GymManager.findByIdAndDelete(req.params.id);

    if (!gymManager) {
      return res.status(404).json({ message: 'مدير الجيم غير موجود' });
    }

    res.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الحذف', error: error.message });
  }
};

