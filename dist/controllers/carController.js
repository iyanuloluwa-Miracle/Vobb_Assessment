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
exports.deleteCar = exports.updateCar = exports.getCarById = exports.getCars = exports.createCar = void 0;
const carService = __importStar(require("../services/carService"));
const createCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Creating car with data:', JSON.stringify(req.body, null, 2));
        const car = yield carService.createCar(req.body);
        console.log('Car created successfully:', JSON.stringify(car, null, 2));
        res.status(201).json(car);
    }
    catch (error) {
        console.error('Error creating car:', {
            message: error.message,
            stack: error.stack,
            requestBody: req.body
        });
        res.status(400).json({
            error: 'Failed to create car',
            details: error.message,
            validationErrors: error.errors || undefined
        });
    }
});
exports.createCar = createCar;
const getCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, brand, carModel, minPrice, maxPrice, available } = req.query;
        const filter = {};
        if (brand)
            filter.brand = brand;
        if (carModel)
            filter.carModel = carModel;
        if (available !== undefined)
            filter.available = available === 'true';
        if (minPrice || maxPrice)
            filter.price = {};
        if (minPrice)
            filter.price.$gte = Number(minPrice);
        if (maxPrice)
            filter.price.$lte = Number(maxPrice);
        const result = yield carService.getCars(filter, +page, +limit);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});
exports.getCars = getCars;
const getCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield carService.getCarById(req.params.id);
        if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }
        res.json(car);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch car' });
    }
});
exports.getCarById = getCarById;
const updateCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield carService.updateCar(req.params.id, req.body);
        if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }
        res.json(car);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update car' });
    }
});
exports.updateCar = updateCar;
const deleteCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield carService.deleteCar(req.params.id);
        if (!car) {
            res.status(404).json({ error: 'Car not found' });
            return;
        }
        res.json({ message: 'Car deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete car' });
    }
});
exports.deleteCar = deleteCar;
