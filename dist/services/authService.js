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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = exports.loginCustomer = exports.registerCustomer = exports.loginManager = exports.registerManager = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Manager_1 = require("../models/Manager");
const Customer_1 = require("../models/Customer");
// Helper function to get JWT secret
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return secret;
};
const registerManager = (managerData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = managerData;
    // Check if manager already exists
    const existingManager = yield Manager_1.Manager.findOne({ email });
    if (existingManager) {
        throw new Error('Manager already exists');
    }
    // Create manager
    const manager = new Manager_1.Manager({ name, email, password });
    yield manager.save();
    return { manager };
});
exports.registerManager = registerManager;
const loginManager = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Find manager
    const manager = yield Manager_1.Manager.findOne({ email });
    if (!manager) {
        throw new Error('Invalid credentials');
    }
    // Check password
    const isMatch = yield manager.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    // Generate token
    const token = jsonwebtoken_1.default.sign({ id: manager._id, role: 'manager' }, getJwtSecret(), { expiresIn: '24h' });
    return { manager, token };
});
exports.loginManager = loginManager;
const registerCustomer = (customerData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = customerData;
    // Check if customer already exists
    const existingCustomer = yield Customer_1.Customer.findOne({ email });
    if (existingCustomer) {
        throw new Error('Customer already exists');
    }
    // Create customer
    const customer = new Customer_1.Customer({ name, email, password });
    yield customer.save();
    return { customer };
});
exports.registerCustomer = registerCustomer;
const loginCustomer = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Find customer
    const customer = yield Customer_1.Customer.findOne({ email });
    if (!customer) {
        throw new Error('Invalid credentials');
    }
    // Check password
    const isMatch = yield customer.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    // Generate token
    const token = jsonwebtoken_1.default.sign({ id: customer._id, role: 'customer' }, getJwtSecret(), { expiresIn: '24h' });
    return { customer, token };
});
exports.loginCustomer = loginCustomer;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const manager = yield Manager_1.Manager.findOne({ email });
    if (!manager) {
        throw new Error('Invalid email or password');
    }
    const isMatch = yield manager.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    const token = jsonwebtoken_1.default.sign({ id: manager._id, email: manager.email, role: manager.role }, getJwtSecret(), { expiresIn: '24h' });
    return {
        token,
        manager: {
            id: manager._id,
            name: manager.name,
            email: manager.email,
            role: manager.role
        }
    };
});
exports.login = login;
const register = (managerData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingManager = yield Manager_1.Manager.findOne({ email: managerData.email });
    if (existingManager) {
        throw new Error('Email already registered');
    }
    const manager = new Manager_1.Manager(managerData);
    yield manager.save();
    const token = jsonwebtoken_1.default.sign({ id: manager._id, email: manager.email, role: manager.role }, getJwtSecret(), { expiresIn: '24h' });
    return {
        token,
        manager: {
            id: manager._id,
            name: manager.name,
            email: manager.email,
            role: manager.role
        }
    };
});
exports.register = register;
