import { registerManager, loginManager, registerCustomer, loginCustomer } from '../../services/authService';
import { Manager } from '../../models/Manager';
import { Customer } from '../../models/Customer';
import mongoose from 'mongoose';

describe('Auth Service', () => {
  const testManager = {
    name: 'Test Manager',
    email: 'test@manager.com',
    password: 'password123'
  };

  const testCustomer = {
    name: 'Test Customer',
    email: 'test@customer.com',
    password: 'password123'
  };

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('Manager Authentication', () => {
    it('should register a new manager', async () => {
      const result = await registerManager(testManager);
      
      expect(result.manager).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.manager.email).toBe(testManager.email);
      expect(result.manager.name).toBe(testManager.name);
    });

    it('should not register a manager with existing email', async () => {
      await expect(registerManager(testManager))
        .rejects
        .toThrow('Manager already exists');
    });

    it('should login an existing manager', async () => {
      const result = await loginManager(testManager.email, testManager.password);
      
      expect(result.manager).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.manager.email).toBe(testManager.email);
    });

    it('should not login with invalid credentials', async () => {
      await expect(loginManager(testManager.email, 'wrongpassword'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });

  describe('Customer Authentication', () => {
    it('should register a new customer', async () => {
      const result = await registerCustomer(testCustomer);
      
      expect(result.customer).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.customer.email).toBe(testCustomer.email);
      expect(result.customer.name).toBe(testCustomer.name);
    });

    it('should not register a customer with existing email', async () => {
      await expect(registerCustomer(testCustomer))
        .rejects
        .toThrow('Customer already exists');
    });

    it('should login an existing customer', async () => {
      const result = await loginCustomer(testCustomer.email, testCustomer.password);
      
      expect(result.customer).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.customer.email).toBe(testCustomer.email);
    });

    it('should not login with invalid credentials', async () => {
      await expect(loginCustomer(testCustomer.email, 'wrongpassword'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });
}); 