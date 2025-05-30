import { registerManager, loginManager, registerCustomer, loginCustomer } from '../../services/authService';
import { Manager } from '../../models/Manager';
import { Customer } from '../../models/Customer';
import mongoose from 'mongoose';

describe('Auth Service', () => {
  beforeEach(async () => {
    await Manager.deleteMany({});
    await Customer.deleteMany({});
  });

  describe('Manager Authentication', () => {
    const testManager = {
      name: 'Test Manager',
      email: `manager${Date.now()}@test.com`,
      password: 'password123'
    };

    it('should register a new manager', async () => {
      const result = await registerManager(testManager);
      
      expect(result.manager).toBeDefined();
      expect(result.manager.email).toBe(testManager.email);
      expect(result.manager.name).toBe(testManager.name);
      // Password should be hashed
      expect(result.manager.password).not.toBe(testManager.password);
    });

    it('should not register a manager with existing email', async () => {
      // First register a manager
      await registerManager(testManager);

      // Try to register again with the same email
      await expect(registerManager({
        ...testManager,
        name: 'Different Name' // Even with different name, should fail
      })).rejects.toThrow('Manager already exists');
    });

    it('should login an existing manager', async () => {
      // First register a manager
      await registerManager(testManager);

      // Then try to login
      const result = await loginManager(testManager.email, testManager.password);
      
      expect(result.manager).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.manager.email).toBe(testManager.email);
    });

    it('should not login with invalid credentials', async () => {
      // First register a manager
      await registerManager(testManager);

      // Try to login with wrong password
      await expect(loginManager(testManager.email, 'wrongpassword'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });

  describe('Customer Authentication', () => {
    const testCustomer = {
      name: 'Test Customer',
      email: `customer${Date.now()}@test.com`,
      password: 'password123'
    };

    it('should register a new customer', async () => {
      const result = await registerCustomer(testCustomer);
      
      expect(result.customer).toBeDefined();
      expect(result.customer.email).toBe(testCustomer.email);
      expect(result.customer.name).toBe(testCustomer.name);
      // Password should be hashed
      expect(result.customer.password).not.toBe(testCustomer.password);
    });

    it('should not register a customer with existing email', async () => {
      // First register a customer
      await registerCustomer(testCustomer);

      // Try to register again with the same email
      await expect(registerCustomer({
        ...testCustomer,
        name: 'Different Name' // Even with different name, should fail
      })).rejects.toThrow('Customer already exists');
    });

    it('should login an existing customer', async () => {
      // First register a customer
      await registerCustomer(testCustomer);

      // Then try to login
      const result = await loginCustomer(testCustomer.email, testCustomer.password);
      
      expect(result.customer).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.customer.email).toBe(testCustomer.email);
    });

    it('should not login with invalid credentials', async () => {
      // First register a customer
      await registerCustomer(testCustomer);

      // Try to login with wrong password
      await expect(loginCustomer(testCustomer.email, 'wrongpassword'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });
}); 