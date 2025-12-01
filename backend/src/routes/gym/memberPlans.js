import express from 'express';
import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
} from '../../controllers/gym/memberPlanController.js';
import { gymAuth } from '../../middleware/auth.js';
import { tenantIsolation } from '../../middleware/tenant.js';

const router = express.Router();

router.use(gymAuth);
router.use(tenantIsolation);

router.get('/', getAllPlans);
router.get('/:id', getPlanById);
router.post('/', createPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;

