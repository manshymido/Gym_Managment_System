import express from 'express';
import { adminLogin, adminRegister, getAdminProfile } from '../../controllers/admin/authController.js';
import { adminAuth } from '../../middleware/auth.js';

const router = express.Router();

router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.get('/profile', adminAuth, getAdminProfile);

export default router;

