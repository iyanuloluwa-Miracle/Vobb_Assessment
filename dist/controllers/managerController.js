"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteManager = exports.updateManager = exports.getManagerById = exports.getManagers = exports.createManager = void 0;
const managerService = __importStar(require("../services/managerService"));
const createManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manager = yield managerService.createManager(req.body);
        res.status(201).json(manager);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create manager' });
    }
});
exports.createManager = createManager;
const getManagers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const result = yield managerService.getManagers(page, limit);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch managers' });
    }
});
exports.getManagers = getManagers;
const getManagerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manager = yield managerService.getManagerById(req.params.id);
        if (!manager) {
            res.status(404).json({ error: 'Manager not found' });
            return;
        }
        res.json(manager);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch manager' });
    }
});
exports.getManagerById = getManagerById;
const updateManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manager = yield managerService.updateManager(req.params.id, req.body);
        if (!manager) {
            res.status(404).json({ error: 'Manager not found' });
            return;
        }
        res.json(manager);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update manager' });
    }
});
exports.updateManager = updateManager;
const deleteManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manager = yield managerService.deleteManager(req.params.id);
        if (!manager) {
            res.status(404).json({ error: 'Manager not found' });
            return;
        }
        res.json({ message: 'Manager deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete manager' });
    }
});
exports.deleteManager = deleteManager;
