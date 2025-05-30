"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const carRoutes_1 = __importDefault(require("./routes/carRoutes"));
const managerRoutes_1 = __importDefault(require("./routes/managerRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const connection_1 = require("./database/connection");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Placeholder route
app.get('/api', (req, res) => {
    res.send('Car Dealership API');
});
// MongoDB connection
(0, connection_1.connectDB)();
app.use('/api/cars', carRoutes_1.default);
app.use('/api/managers', managerRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/customers', customerRoutes_1.default);
exports.default = app;
