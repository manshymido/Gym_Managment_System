import { body, validationResult } from 'express-validator';

// Middleware to check validation results
// Validations should be applied before this middleware in the route chain
export const validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Common validation rules
export const emailValidation = body('email')
  .isEmail()
  .withMessage('البريد الإلكتروني غير صحيح');

export const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');

export const nameValidation = body('name')
  .trim()
  .notEmpty()
  .withMessage('الاسم مطلوب')
  .isLength({ min: 2 })
  .withMessage('الاسم يجب أن يكون حرفين على الأقل');

