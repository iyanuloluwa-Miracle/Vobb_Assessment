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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getAllCustomers = void 0;
const Customer_1 = require("../models/Customer");
const getAllCustomers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield Customer_1.Customer.find({})
            .select('-password') // Exclude password from response
            .sort({ createdAt: -1 });
        return customers;
    }
    catch (error) {
        console.error('Error getting all customers:', error);
        throw error;
    }
});
exports.getAllCustomers = getAllCustomers;
const getCustomerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield Customer_1.Customer.findById(id).select('-password');
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    }
    catch (error) {
        console.error(`Error getting customer with id ${id}:`, error);
        throw error;
    }
});
exports.getCustomerById = getCustomerById;
const updateCustomer = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Prevent updating sensitive fields
        const { password, role } = updateData, safeUpdateData = __rest(updateData, ["password", "role"]);
        const customer = yield Customer_1.Customer.findByIdAndUpdate(id, safeUpdateData, { new: true, runValidators: true }).select('-password');
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    }
    catch (error) {
        console.error(`Error updating customer with id ${id}:`, error);
        throw error;
    }
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield Customer_1.Customer.findByIdAndDelete(id);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return { message: 'Customer deleted successfully' };
    }
    catch (error) {
        console.error(`Error deleting customer with id ${id}:`, error);
        throw error;
    }
});
exports.deleteCustomer = deleteCustomer;
