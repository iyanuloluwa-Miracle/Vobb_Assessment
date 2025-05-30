import { Request, Response } from 'express';
import * as customerService from '../services/customerService';

export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (error: any) {
    console.error('Controller error - Get all customers:', error);
    res.status(500).json({
      error: 'Failed to fetch customers',
      details: error.message
    });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    res.json(customer);
  } catch (error: any) {
    console.error('Controller error - Get customer by ID:', error);
    if (error.message === 'Customer not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({
        error: 'Failed to fetch customer',
        details: error.message
      });
    }
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if the authenticated user matches the requested customer ID
    const authenticatedUserId = (req as any).user.id;
    const requestedCustomerId = req.params.id;

    if (authenticatedUserId !== requestedCustomerId && (req as any).user.role !== 'manager') {
      res.status(403).json({ error: 'Unauthorized to update this customer' });
      return;
    }

    const customer = await customerService.updateCustomer(req.params.id, req.body);
    res.json(customer);
  } catch (error: any) {
    console.error('Controller error - Update customer:', error);
    if (error.message === 'Customer not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({
        error: 'Failed to update customer',
        details: error.message
      });
    }
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if the authenticated user matches the requested customer ID
    const authenticatedUserId = (req as any).user.id;
    const requestedCustomerId = req.params.id;

    if (authenticatedUserId !== requestedCustomerId && (req as any).user.role !== 'manager') {
      res.status(403).json({ error: 'Unauthorized to delete this customer' });
      return;
    }

    await customerService.deleteCustomer(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    console.error('Controller error - Delete customer:', error);
    if (error.message === 'Customer not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({
        error: 'Failed to delete customer',
        details: error.message
      });
    }
  }
}; 