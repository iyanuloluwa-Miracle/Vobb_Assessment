import { Router } from 'express';
import {
  createManager,
  getManagers,
  getManagerById,
  updateManager,
  deleteManager,
} from '../controllers/managerController';

const router = Router();

router.post('/', createManager);
router.get('/', getManagers);
router.get('/:id', getManagerById);
router.put('/:id', updateManager);
router.delete('/:id', deleteManager);

export default router; 