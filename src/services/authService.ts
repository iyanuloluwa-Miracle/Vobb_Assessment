import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Manager from '../models/Manager';
import Customer from '../models/Customer';

export const registerManager = async (managerData: any) => {
  const { name, email, password } = managerData;
  
  // Check if manager already exists
  const existingManager = await Manager.findOne({ email });
  if (existingManager) {
    throw new Error('Manager already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create manager
  const manager = await Manager.create({
    name,
    email,
    password: hashedPassword
  });

  // Generate token
  const token = jwt.sign(
    { id: manager._id, role: 'manager' },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '24h' }
  );

  return { manager, token };
};

export const loginManager = async (email: string, password: string) => {
  // Find manager
  const manager = await Manager.findOne({ email });
  if (!manager) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, manager.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { id: manager._id, role: 'manager' },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '24h' }
  );

  return { manager, token };
};

export const registerCustomer = async (customerData: any) => {
  const { name, email, password } = customerData;
  
  // Check if customer already exists
  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    throw new Error('Customer already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create customer
  const customer = await Customer.create({
    name,
    email,
    password: hashedPassword
  });

  // Generate token
  const token = jwt.sign(
    { id: customer._id, role: 'customer' },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '24h' }
  );

  return { customer, token };
};

export const loginCustomer = async (email: string, password: string) => {
  // Find customer
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, customer.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { id: customer._id, role: 'customer' },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '24h' }
  );

  return { customer, token };
}; 