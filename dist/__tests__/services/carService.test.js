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
const Car_1 = require("../../models/Car");
const Category_1 = require("../../models/Category");
const carService_1 = require("../../services/carService");
const mongoose_1 = __importDefault(require("mongoose"));
describe('Car Service', () => {
    let testCategory;
    let createdTestCar;
    const testCar = {
        brand: 'Test Brand',
        carModel: 'Test Model',
        year: 2023,
        price: 25000,
        description: 'Test Description',
        mileage: 0,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        color: 'Black',
        vin: 'TEST123456789',
        features: ['Feature 1', 'Feature 2'],
        images: ['image1.jpg', 'image2.jpg'],
        available: true
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a test category
        testCategory = yield Category_1.Category.create({
            name: 'Test Category',
            description: 'Test Category Description'
        });
        // Create a test car
        createdTestCar = yield Car_1.Car.create(Object.assign(Object.assign({}, testCar), { category: testCategory._id }));
    }));
    describe('Car CRUD Operations', () => {
        let createdCar;
        it('should create a new car', () => __awaiter(void 0, void 0, void 0, function* () {
            const carData = Object.assign(Object.assign({}, testCar), { category: testCategory._id });
            createdCar = yield (0, carService_1.createCar)(carData);
            expect(createdCar).toBeDefined();
            expect(createdCar.brand).toBe(testCar.brand);
            expect(createdCar.carModel).toBe(testCar.carModel);
            expect(createdCar.category.toString()).toBe(testCategory._id.toString());
        }));
        it('should get all cars', () => __awaiter(void 0, void 0, void 0, function* () {
            const cars = yield (0, carService_1.getCars)();
            expect(Array.isArray(cars.cars)).toBe(true);
            expect(cars.cars.length).toBeGreaterThan(0);
            const firstCar = cars.cars[0];
            expect(firstCar.brand).toBe(testCar.brand);
        }));
        it('should get car by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const car = yield (0, carService_1.getCarById)(createdTestCar._id.toString());
            expect(car).toBeDefined();
            expect(car.brand).toBe(testCar.brand);
            expect(car.carModel).toBe(testCar.carModel);
        }));
        it('should update car', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedData = {
                brand: 'Updated Brand',
                price: 30000
            };
            const updatedCar = yield (0, carService_1.updateCar)(createdCar._id.toString(), updatedData);
            expect(updatedCar).toBeDefined();
            expect(updatedCar.brand).toBe(updatedData.brand);
            expect(updatedCar.price).toBe(updatedData.price);
            expect(updatedCar.carModel).toBe(testCar.carModel); // Unchanged field
        }));
        it('should delete car', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, carService_1.deleteCar)(createdCar._id.toString());
            const deletedCar = yield Car_1.Car.findById(createdCar._id);
            expect(deletedCar).toBeNull();
        }));
        it('should return null for non-existent car id', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = new mongoose_1.default.Types.ObjectId().toString();
            const car = yield (0, carService_1.getCarById)(nonExistentId);
            expect(car).toBeNull();
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Car_1.Car.deleteMany({});
        yield Category_1.Category.deleteMany({});
    }));
});
