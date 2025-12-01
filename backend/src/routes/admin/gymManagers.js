import express from 'express';
import {
  getAllGymManagers,
  getGymManagerById,
  updateGymManager,
  deleteGymManager
} from '../../controllers/admin/gymManagerController.js';
import { adminAuth } from '../../middleware/auth.js';

const router = express.Router();

router.use(adminAuth);

router.get('/', getAllGymManagers);
router.get('/:id', getGymManagerById);
router.put('/:id', updateGymManager);
router.delete('/:id', deleteGymManager);

export default router;

