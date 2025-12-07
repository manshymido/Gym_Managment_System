import Admin from '../../models/Admin.js';
import { generateToken } from '../../utils/jwt.js';
import { validate, emailValidation, passwordValidation, nameValidation } from '../../utils/validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const adminRegister = [
  nameValidation,
  emailValidation,
  passwordValidation,
  validate,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      const error = new Error('المدير موجود بالفعل');
      error.status = 400;
      throw error;
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
  })
];

export const adminLogin = [
  emailValidation,
  passwordValidation,
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      const error = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      error.status = 401;
      throw error;
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      const error = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      error.status = 401;
      throw error;
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
  })
];

export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-password');
  res.json(admin);
});

