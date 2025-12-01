import express from 'express';
import {
  generateRevenueReport,
  generateMembersReport,
  generateAttendanceReport,
  getAllReports,
  getReportById
} from '../../controllers/gym/reportController.js';
import { gymAuth } from '../../middleware/auth.js';
import { tenantIsolation } from '../../middleware/tenant.js';

const router = express.Router();

router.use(gymAuth);
router.use(tenantIsolation);

router.get('/', getAllReports);
router.get('/:id', getReportById);
router.post('/revenue', generateRevenueReport);
router.post('/members', generateMembersReport);
router.post('/attendance', generateAttendanceReport);

export default router;

