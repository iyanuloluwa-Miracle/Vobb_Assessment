import { Manager, IManager } from '../models/Manager';
import { ValidationError, validateEmail, validatePassword, validateMongoId, validatePaginationParams } from '../utils/validations';
import bcrypt from 'bcryptjs';

const validateManager = (data: Partial<IManager>, isCreating: boolean = false): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Name validation
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

  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Password validation (only for creation or if password is being updated)
  if (isCreating || data.password) {
    if (!data.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (!validatePassword(data.password)) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
    }
  }

  // Role validation
  if (data.role && !['admin', 'manager'].includes(data.role)) {
    errors.push({ field: 'role', message: 'Invalid role. Must be either "admin" or "manager"' });
  }

  // Phone validation
  if (data.phone && (typeof data.phone !== 'string' || !/^\+?[\d\s-]{10,}$/.test(data.phone))) {
    errors.push({ field: 'phone', message: 'Invalid phone number format' });
  }

  return errors;
};

export const createManager = async (managerData: Partial<IManager>): Promise<IManager> => {
  // Validate manager data
  const validationErrors = validateManager(managerData, true);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
  }

  // Check if manager with same email exists
  const existingManager = await Manager.findOne({ email: managerData.email });
  if (existingManager) {
    throw new Error('Manager with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(managerData.password!, salt);

  const manager = new Manager({
    ...managerData,
    password: hashedPassword
  });

  return manager.save();
};

export const getManagers = async (page: number = 1, limit: number = 10): Promise<{ managers: IManager[], total: number, page: number, totalPages: number }> => {
  const paginationErrors = validatePaginationParams(page, limit);
  if (paginationErrors.length > 0) {
    throw new Error(`Validation failed: ${paginationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
  }

  const skip = (page - 1) * limit;
  const [managers, total] = await Promise.all([
    Manager.find().select('-password').skip(skip).limit(limit),
    Manager.countDocuments()
  ]);

  return {
    managers,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getManagerById = async (id: string): Promise<IManager | null> => {
  if (!validateMongoId(id)) {
    throw new Error('Invalid manager ID format');
  }
  return Manager.findById(id).select('-password');
};

export const updateManager = async (id: string, managerData: Partial<IManager>): Promise<IManager | null> => {
  if (!validateMongoId(id)) {
    throw new Error('Invalid manager ID format');
  }

  // Validate update data if provided
  if (Object.keys(managerData).length > 0) {
    const validationErrors = validateManager(managerData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
    }
  }

  // Check if email is being updated and already exists
  if (managerData.email) {
    const existingManager = await Manager.findOne({ 
      email: managerData.email,
      _id: { $ne: id }
    });
    if (existingManager) {
      throw new Error('Manager with this email already exists');
    }
  }

  // Hash password if it's being updated
  if (managerData.password) {
    const salt = await bcrypt.genSalt(10);
    managerData.password = await bcrypt.hash(managerData.password, salt);
  }

  const updatedManager = await Manager.findByIdAndUpdate(id, managerData, { new: true }).select('-password');
  if (!updatedManager) {
    throw new Error('Manager not found');
  }
  return updatedManager;
};

export const deleteManager = async (id: string): Promise<IManager | null> => {
  if (!validateMongoId(id)) {
    throw new Error('Invalid manager ID format');
  }

  const deletedManager = await Manager.findByIdAndDelete(id).select('-password');
  if (!deletedManager) {
    throw new Error('Manager not found');
  }
  return deletedManager;
}; 