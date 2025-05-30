import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Manager, IManager } from '../models/Manager';
import { Customer, ICustomer } from '../models/Customer';
import { User, IUser } from '../models/User';
import { ValidationError, validateEmail, validatePassword } from '../utils/validations';

// Helper function to get JWT secret
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

const validateAuthData = (data: Partial<IUser>, isRegistration: boolean = false): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (isRegistration && !validatePassword(data.password)) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
  }

  // Name validation (only for registration)
  if (isRegistration) {
    if (!data.firstName) {
      errors.push({ field: 'firstName', message: 'First name is required' });
    } else if (typeof data.firstName !== 'string' || data.firstName.length < 2 || data.firstName.length > 50) {
      errors.push({ field: 'firstName', message: 'First name must be between 2 and 50 characters' });
    }

    if (!data.lastName) {
      errors.push({ field: 'lastName', message: 'Last name is required' });
    } else if (typeof data.lastName !== 'string' || data.lastName.length < 2 || data.lastName.length > 50) {
      errors.push({ field: 'lastName', message: 'Last name must be between 2 and 50 characters' });
    }

    if (data.phone && (typeof data.phone !== 'string' || !/^\+?[\d\s-]{10,}$/.test(data.phone))) {
      errors.push({ field: 'phone', message: 'Invalid phone number format' });
    }
  }

  return errors;
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

export const login = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  // Validate login data
  const validationErrors = validateAuthData({ email, password });
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

export const register = async (userData: Partial<IUser>): Promise<{ user: IUser; token: string }> => {
  // Validate registration data
  const validationErrors = validateAuthData(userData, true);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password!, salt);

  // Create new user
  const user = new User({
    ...userData,
    password: hashedPassword
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  // Validate new password
  if (!validatePassword(newPassword)) {
    throw new Error('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  user.password = hashedPassword;
  await user.save();
}; 