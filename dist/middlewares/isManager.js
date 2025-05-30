"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isManager = void 0;
const isManager = (req, res, next) => {
    const user = req.user;
    if (user && user.role === 'manager') {
        next();
    }
    else {
        res.status(403).json({ error: 'Access denied. Manager role required.' });
    }
};
exports.isManager = isManager;
