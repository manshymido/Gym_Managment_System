import GymManager from '../../models/GymManager.js';
import { generateToken } from '../../utils/jwt.js';
import { validate, emailValidation, passwordValidation, nameValidation } from '../../utils/validation.js';

export const gymManagerRegister = [
  nameValidation,
  emailValidation,
  passwordValidation,
  validate,
  async (req, res) => {
    try {
      const { name, email, password, gymName, phone, address } = req.body;

      // Check if gym manager already exists
      const existingManager = await GymManager.findOne({ email });
      if (existingManager) {
        return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
      }

      // Create gym manager
      const gymManager = await GymManager.create({
        name,
        email,
        password,
        gymName,
        phone,
        address
      });

      const token = generateToken({ id: gymManager._id, type: 'gym_manager' });

      res.status(201).json({
        message: 'تم إنشاء الحساب بنجاح',
        token,
        gymManager: {
          id: gymManager._id,
          name: gymManager.name,
          email: gymManager.email,
          gymName: gymManager.gymName,
          subscriptionStatus: gymManager.subscriptionStatus
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'خطأ في إنشاء الحساب', error: error.message });
    }
  }
];

export const gymManagerLogin = [
  emailValidation,
  passwordValidation,
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find gym manager
      const gymManager = await GymManager.findOne({ email });
      if (!gymManager) {
        return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      }

      if (!gymManager.isActive) {
        return res.status(403).json({ message: 'الحساب معطل' });
      }

      // Check password
      const isMatch = await gymManager.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      }

      const token = generateToken({ id: gymManager._id, type: 'gym_manager' });

      res.json({
        message: 'تم تسجيل الدخول بنجاح',
        token,
        gymManager: {
          id: gymManager._id,
          name: gymManager.name,
          email: gymManager.email,
          gymName: gymManager.gymName,
          subscriptionStatus: gymManager.subscriptionStatus
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'خطأ في تسجيل الدخول', error: error.message });
    }
  }
];

export const getGymManagerProfile = async (req, res) => {
  try {
    const gymManager = await GymManager.findById(req.gymManager._id)
      .select('-password')
      .populate('currentSubscription');
    res.json(gymManager);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

