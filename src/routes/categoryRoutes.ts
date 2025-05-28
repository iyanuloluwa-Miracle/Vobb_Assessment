import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', auth, createCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

export default router; 