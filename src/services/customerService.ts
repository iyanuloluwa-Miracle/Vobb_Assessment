import { Customer, ICustomer } from '../models/Customer';

export const getAllCustomers = async () => {
  try {
    const customers = await Customer.find({})
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 });
    return customers;
  } catch (error: any) {
    console.error('Error getting all customers:', error);
    throw error;
  }
};

export const getCustomerById = async (id: string) => {
  try {
    const customer = await Customer.findById(id).select('-password');
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  } catch (error: any) {
    console.error(`Error getting customer with id ${id}:`, error);
    throw error;
  }
};

export const updateCustomer = async (id: string, updateData: Partial<ICustomer>) => {
  try {
    // Prevent updating sensitive fields
    const { password, role, ...safeUpdateData } = updateData;
    
    const customer = await Customer.findByIdAndUpdate(
      id,
      safeUpdateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  } catch (error: any) {
    console.error(`Error updating customer with id ${id}:`, error);
    throw error;
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return { message: 'Customer deleted successfully' };
  } catch (error: any) {
    console.error(`Error deleting customer with id ${id}:`, error);
    throw error;
  }
}; 