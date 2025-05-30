"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const auth_1 = require("../middlewares/auth");
const isManager_1 = require("../middlewares/isManager");
const router = (0, express_1.Router)();
// Get all customers (Manager only)
router.get('/', auth_1.auth, isManager_1.isManager, customerController_1.getAllCustomers);
// Get customer profile (Auth required)
router.get('/:id', auth_1.auth, customerController_1.getCustomerById);
// Update customer profile (Auth required)
router.put('/:id', auth_1.auth, customerController_1.updateCustomer);
// Delete customer account (Auth required)
router.delete('/:id', auth_1.auth, customerController_1.deleteCustomer);
exports.default = router;
