import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Manager, IManager } from '../models/Manager';
import { Customer, ICustomer } from '../models/Customer';

// Helper function to get JWT secret
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

export const registerManager = async (managerData: Partial<IManager>) => {
  const { name, email, password } = managerData;
  
  // Check if manager already exists
  const existingManager = await Manager.findOne({ email });
  if (existingManager) {
    throw new Error('Manager already exists');
  }

  // Create manager
  const manager = new Manager({ name, email, password });
  await manager.save();

  return { manager };
};

export const loginManager = async (email: string, password: string) => {
  // Find manager
  const manager = await Manager.findOne({ email });
  if (!manager) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await manager.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { id: manager._id, role: 'manager' },
    getJwtSecret(),
    { expiresIn: '24h' }
  );

  return { manager, token };
};

export const registerCustomer = async (customerData: Partial<ICustomer>) => {
  const { name, email, password } = customerData;
  
  // Check if customer already exists
  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    throw new Error('Customer already exists');
  }

  // Create customer
  const customer = new Customer({ name, email, password });
  await customer.save();

  return { customer };
};

export const loginCustomer = async (email: string, password: string) => {
  // Find customer
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await customer.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { id: customer._id, role: 'customer' },
    getJwtSecret(),
    { expiresIn: '24h' }
  );

  return { customer, token };
};

export const login = async (email: string, password: string) => {
  const manager = await Manager.findOne({ email });
  if (!manager) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await manager.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: manager._id, email: manager.email, role: manager.role },
    getJwtSecret(),
    { expiresIn: '24h' }
  );

  return {
    token,
    manager: {
      id: manager._id,
      name: manager.name,
      email: manager.email,
      role: manager.role
    }
  };
};

export const register = async (managerData: Partial<IManager>) => {
  const existingManager = await Manager.findOne({ email: managerData.email });
  if (existingManager) {
    throw new Error('Email already registered');
  }

  const manager = new Manager(managerData);
  await manager.save();

  const token = jwt.sign(
    { id: manager._id, email: manager.email, role: manager.role },
    getJwtSecret(),
    { expiresIn: '24h' }
  );

  return {
    token,
    manager: {
      id: manager._id,
      name: manager.name,
      email: manager.email,
      role: manager.role
    }
  };
}; 