import GymManager from '../../models/GymManager.js';
import { generateToken } from '../../utils/jwt.js';
import { validate, emailValidation, passwordValidation, nameValidation } from '../../utils/validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const gymManagerRegister = [
  nameValidation,
  emailValidation,
  passwordValidation,
  validate,
  asyncHandler(async (req, res) => {
    const { name, email, password, gymName, phone, address } = req.body;

    // Check if gym manager already exists
    const existingManager = await GymManager.findOne({ email });
    if (existingManager) {
      const error = new Error('البريد الإلكتروني مستخدم بالفعل');
      error.status = 400;
      throw error;
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
  })
];

export const gymManagerLogin = [
  emailValidation,
  passwordValidation,
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find gym manager
    const gymManager = await GymManager.findOne({ email });
    if (!gymManager) {
      const error = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      error.status = 401;
      throw error;
    }

    if (!gymManager.isActive) {
      const error = new Error('الحساب معطل');
      error.status = 403;
      throw error;
    }

    // Check password
    const isMatch = await gymManager.comparePassword(password);
    if (!isMatch) {
      const error = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      error.status = 401;
      throw error;
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
  })
];

export const getGymManagerProfile = asyncHandler(async (req, res) => {
  const gymManager = await GymManager.findById(req.gymManager._id)
    .select('-password')
    .populate('currentSubscription');
  res.json(gymManager);
});

