"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Manager routes
router.post('/register/manager', authController_1.registerManager);
router.post('/login/manager', authController_1.loginManager);
// Customer routes
router.post('/register/customer', authController_1.registerCustomer);
router.post('/login/customer', authController_1.loginCustomer);
exports.default = router;
