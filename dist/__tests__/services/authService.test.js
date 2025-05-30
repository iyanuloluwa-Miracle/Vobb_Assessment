"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = require("../../services/authService");
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
        it('should register a new manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, authService_1.registerManager)(testManager);
            expect(result.manager).toBeDefined();
            expect(result.manager.email).toBe(testManager.email);
        }));
        it('should not register a manager with existing email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, authService_1.registerManager)(testManager))
                .rejects
                .toThrow('Manager already exists');
        }));
        it('should login an existing manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, authService_1.loginManager)(testManager.email, testManager.password);
            expect(result.manager).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.manager.email).toBe(testManager.email);
        }));
        it('should not login with invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, authService_1.loginManager)(testManager.email, 'wrongpassword'))
                .rejects
                .toThrow('Invalid credentials');
        }));
    });
    describe('Customer Authentication', () => {
        it('should register a new customer', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, authService_1.registerCustomer)(testCustomer);
            expect(result.customer).toBeDefined();
            expect(result.customer.email).toBe(testCustomer.email);
        }));
        it('should not register a customer with existing email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, authService_1.registerCustomer)(testCustomer))
                .rejects
                .toThrow('Customer already exists');
        }));
        it('should login an existing customer', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, authService_1.loginCustomer)(testCustomer.email, testCustomer.password);
            expect(result.customer).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.customer.email).toBe(testCustomer.email);
        }));
        it('should not login with invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, authService_1.loginCustomer)(testCustomer.email, 'wrongpassword'))
                .rejects
                .toThrow('Invalid credentials');
        }));
    });
});
