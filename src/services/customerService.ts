import { Customer, ICustomer } from '../models/Customer';
import { ValidationError, validateEmail, validateMongoId, validatePaginationParams } from '../utils/validations';

const validateCustomer = (data: Partial<ICustomer>): ValidationError[] => {
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

  // Phone validation
  if (!data.phone) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (typeof data.phone !== 'string' || !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number format' });
  }

  // Address validation
  if (data.address) {
    if (typeof data.address !== 'string' || data.address.length < 5 || data.address.length > 200) {
      errors.push({ field: 'address', message: 'Address must be between 5 and 200 characters' });
    }
  }

  // Notes validation
  if (data.notes && (typeof data.notes !== 'string' || data.notes.length > 1000)) {
    errors.push({ field: 'notes', message: 'Notes cannot exceed 1000 characters' });
  }

  return errors;
};

export const createCustomer = async (customerData: Partial<ICustomer>): Promise<ICustomer> => {
  // Validate customer data
  const validationErrors = validateCustomer(customerData);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
  }

  // Check if customer with same email exists
  const existingCustomer = await Customer.findOne({ email: customerData.email });
  if (existingCustomer) {
    throw new Error('Customer with this email already exists');
  }

  const customer = new Customer(customerData);
  return customer.save();
};

export const getCustomers = async (page: number = 1, limit: number = 10): Promise<{ customers: ICustomer[], total: number, page: number, totalPages: number }> => {
  const paginationErrors = validatePaginationParams(page, limit);
  if (paginationErrors.length > 0) {
    throw new Error(`Validation failed: ${paginationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
  }

  const skip = (page - 1) * limit;
  const [customers, total] = await Promise.all([
    Customer.find().skip(skip).limit(limit),
    Customer.countDocuments()
  ]);

  return {
    customers,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getCustomerById = async (id: string): Promise<ICustomer | null> => {
  if (!validateMongoId(id)) {
    throw new Error('Invalid customer ID format');
  }
  return Customer.findById(id);
};

export const updateCustomer = async (id: string, customerData: Partial<ICustomer>): Promise<ICustomer | null> => {
  if (!validateMongoId(id)) {
    throw new Error('Invalid customer ID format');
  }

  // Validate update data if provided
  if (Object.keys(customerData).length > 0) {
    const validationErrors = validateCustomer(customerData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
    }
  }

  // Check if email is being updated and already exists
  if (customerData.email) {
    const existingCustomer = await Customer.findOne({ 
      email: customerData.email,
      _id: { $ne: id }
    });
    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(id, customerData, { new: true });
  if (!updatedCustomer) {
    throw new Error('Customer not found');
  }
  return updatedCustomer;
};

export const deleteCustomer = async (id: string): Promise<ICustomer | null> => {
  if (!validateMongoId(id)) {
    throw new Error('Invalid customer ID format');
  }

  const deletedCustomer = await Customer.findByIdAndDelete(id);
  if (!deletedCustomer) {
    throw new Error('Customer not found');
  }
  return deletedCustomer;
}; 