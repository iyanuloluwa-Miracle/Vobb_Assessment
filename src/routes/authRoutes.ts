import { Router } from 'express';
import {
  registerManager,
  loginManager,
  registerCustomer,
  loginCustomer
} from '../controllers/authController';

const router = Router();

// Manager routes
router.post('/register/manager', registerManager);
router.post('/login/manager', loginManager);

// Customer routes
router.post('/register/customer', registerCustomer);
router.post('/login/customer', loginCustomer);

export default router; 