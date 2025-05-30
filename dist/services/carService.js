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
exports.deleteCar = exports.updateCar = exports.getCarById = exports.getCars = exports.createCar = void 0;
const Car_1 = require("../models/Car");
const createCar = (carData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Validating car data:', JSON.stringify(carData, null, 2));
        // Validate required fields
        const requiredFields = ['brand', 'carModel', 'year', 'price', 'category'];
        const missingFields = requiredFields.filter(field => !carData[field]);
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        const car = new Car_1.Car(carData);
        console.log('Created car instance, about to save:', JSON.stringify(car, null, 2));
        const savedCar = yield car.save();
        console.log('Car saved successfully:', JSON.stringify(savedCar, null, 2));
        return savedCar;
    }
    catch (error) {
        console.error('Error in createCar service:', {
            message: error.message,
            stack: error.stack,
            validationErrors: error.errors,
            carData
        });
        throw error; // Re-throw to be handled by controller
    }
});
exports.createCar = createCar;
const getCars = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const cars = yield Car_1.Car.find(filter)
        .populate('category')
        .skip(skip)
        .limit(limit);
    const total = yield Car_1.Car.countDocuments(filter);
    return {
        cars,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
});
exports.getCars = getCars;
const getCarById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Car_1.Car.findById(id).populate('category');
});
exports.getCarById = getCarById;
const updateCar = (id, carData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Car_1.Car.findByIdAndUpdate(id, carData, { new: true }).populate('category');
});
exports.updateCar = updateCar;
const deleteCar = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Car_1.Car.findByIdAndDelete(id);
});
exports.deleteCar = deleteCar;
