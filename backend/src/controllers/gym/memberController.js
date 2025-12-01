import GymMember from '../../models/GymMember.js';

export const getAllMembers = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await GymMember.findOne({
      _id: req.params.id,
      gymManager: req.gymManager._id
    });

    if (!member) {
      return res.status(404).json({ message: 'العضو غير موجود' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const memberData = {
      ...req.body,
      gymManager: req.gymManager._id
    };

    const member = await GymMember.create(memberData);
    res.status(201).json({ message: 'تم إضافة العضو بنجاح', member });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إضافة العضو', error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const member = await GymMember.findOneAndUpdate(
      { _id: req.params.id, gymManager: req.gymManager._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'العضو غير موجود' });
    }

    res.json({ message: 'تم التحديث بنجاح', member });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التحديث', error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await GymMember.findOneAndDelete({
      _id: req.params.id,
      gymManager: req.gymManager._id
    });

    if (!member) {
      return res.status(404).json({ message: 'العضو غير موجود' });
    }

    res.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الحذف', error: error.message });
  }
};

