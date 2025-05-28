import { Router } from 'express';
import {
  createManager,
  getManagers,
  getManagerById,
  updateManager,
  deleteManager,
} from '../controllers/managerController';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/', auth, createManager);
router.get('/', auth, getManagers);
router.get('/:id', auth, getManagerById);
router.put('/:id', auth, updateManager);
router.delete('/:id', auth, deleteManager);

export default router; 