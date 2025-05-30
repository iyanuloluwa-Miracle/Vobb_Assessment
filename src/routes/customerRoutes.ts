import { Router } from 'express';
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController';
import { auth } from '../middlewares/auth';
import { isManager } from '../middlewares/isManager';

const router = Router();

// Get all customers (Manager only)
router.get('/', auth, isManager, getAllCustomers);

// Get customer profile (Auth required)
router.get('/:id', auth, getCustomerById);

// Update customer profile (Auth required)
router.put('/:id', auth, updateCustomer);

// Delete customer account (Auth required)
router.delete('/:id', auth, deleteCustomer);

export default router; 