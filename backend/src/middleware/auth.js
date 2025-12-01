import { verifyToken } from '../utils/jwt.js';
import Admin from '../models/Admin.js';
import GymManager from '../models/GymManager.js';

// Admin authentication middleware
export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'لا يوجد رمز مصادقة' });
    }

    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'غير مصرح' });
    }

    req.admin = admin;
    req.userId = admin._id;
    req.userType = 'admin';
    next();
  } catch (error) {
    res.status(401).json({ message: 'رمز مصادقة غير صحيح' });
  }
};

// Gym Manager authentication middleware
export const gymAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'لا يوجد رمز مصادقة' });
    }

    const decoded = verifyToken(token);
    const gymManager = await GymManager.findById(decoded.id);

    if (!gymManager || !gymManager.isActive) {
      return res.status(401).json({ message: 'غير مصرح' });
    }

    // Check subscription status
    if (gymManager.subscriptionStatus !== 'active') {
      return res.status(403).json({ 
        message: 'اشتراكك غير نشط. يرجى تجديد الاشتراك',
        subscriptionStatus: gymManager.subscriptionStatus
      });
    }

    req.gymManager = gymManager;
    req.userId = gymManager._id;
    req.userType = 'gym_manager';
    next();
  } catch (error) {
    res.status(401).json({ message: 'رمز مصادقة غير صحيح' });
  }
};

