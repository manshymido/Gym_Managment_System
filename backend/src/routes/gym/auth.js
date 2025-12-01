import express from 'express';
import { gymManagerRegister, gymManagerLogin, getGymManagerProfile } from '../../controllers/gym/authController.js';
import { gymAuth } from '../../middleware/auth.js';

const router = express.Router();

router.post('/register', gymManagerRegister);
router.post('/login', gymManagerLogin);
router.get('/profile', gymAuth, getGymManagerProfile);

export default router;

