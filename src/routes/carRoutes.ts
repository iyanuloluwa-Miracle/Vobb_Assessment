import { Router } from 'express';
import {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} from '../controllers/carController';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/', auth, createCar);
router.get('/', getCars);
router.get('/:id', auth, getCarById);
router.put('/:id', auth, updateCar);
router.delete('/:id', auth, deleteCar);

export default router; 