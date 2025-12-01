import Admin from '../../models/Admin.js';
import { generateToken } from '../../utils/jwt.js';
import { validate, emailValidation, passwordValidation, nameValidation } from '../../utils/validation.js';

export const adminRegister = [
  nameValidation,
  emailValidation,
  passwordValidation,
  validate,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'المدير موجود بالفعل' });
      }

      // Create admin
      const admin = await Admin.create({ name, email, password });

      const token = generateToken({ id: admin._id, type: 'admin' });

      res.status(201).json({
        message: 'تم إنشاء الحساب بنجاح',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'خطأ في إنشاء الحساب', error: error.message });
    }
  }
];

export const adminLogin = [
  emailValidation,
  passwordValidation,
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find admin
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      }

      // Check password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      }

      const token = generateToken({ id: admin._id, type: 'admin' });

      res.json({
        message: 'تم تسجيل الدخول بنجاح',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'خطأ في تسجيل الدخول', error: error.message });
    }
  }
];

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البيانات', error: error.message });
  }
};

