import express from 'express';
import {
  getAllAttendance,
  checkIn,
  checkOut,
  getMemberAttendance
} from '../../controllers/gym/attendanceController.js';
import { gymAuth } from '../../middleware/auth.js';
import { tenantIsolation } from '../../middleware/tenant.js';

const router = express.Router();

router.use(gymAuth);
router.use(tenantIsolation);

router.get('/', getAllAttendance);
router.get('/member/:memberId', getMemberAttendance);
router.post('/checkin', checkIn);
router.put('/:id/checkout', checkOut);

export default router;

