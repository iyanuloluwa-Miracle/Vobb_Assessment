import { Car } from '../../models/Car';
import { Category } from '../../models/Category';
import { createCar, getCars, getCarById, updateCar, deleteCar, getCarsByCategory } from '../../services/carService';
import mongoose from 'mongoose';

describe('Car Service', () => {
  let testCategory: any;
  const testCar = {
    name: 'Test Car',
    model: '2023',
    price: 25000,
    description: 'Test Description',
    specifications: {
      engine: '2.0L',
      transmission: 'Automatic',
      fuelType: 'Gasoline'
    },
    images: ['image1.jpg', 'image2.jpg'],
    available: true
  };

  beforeAll(async () => {
    // Create a test category
    testCategory = await Category.create({
      name: 'Test Category',
      description: 'Test Category Description',
      features: ['Feature 1', 'Feature 2']
    });
  });

  describe('Car CRUD Operations', () => {
    let createdCar: any;

    it('should create a new car', async () => {
      const carData = { ...testCar, categoryId: testCategory._id };
      createdCar = await createCar(carData);

      expect(createdCar).toBeDefined();
      expect(createdCar.name).toBe(testCar.name);
      expect(createdCar.model).toBe(testCar.model);
      expect(createdCar.categoryId.toString()).toBe(testCategory._id.toString());
    });

    it('should get all cars', async () => {
      const cars = await getCars();
      
      expect(Array.isArray(cars)).toBe(true);
      expect(cars.length).toBeGreaterThan(0);
      expect(cars[0].name).toBe(testCar.name);
    });

    it('should get car by id', async () => {
      const car = await getCarById(createdCar._id);
      
      expect(car).toBeDefined();
      expect(car!.name).toBe(testCar.name);
      expect(car!.model).toBe(testCar.model);
    });

    it('should get cars by category', async () => {
      const cars = await getCarsByCategory(testCategory._id);
      
      expect(Array.isArray(cars)).toBe(true);
      expect(cars.length).toBeGreaterThan(0);
      expect(cars[0].categoryId.toString()).toBe(testCategory._id.toString());
    });

    it('should update car', async () => {
      const updatedData = {
        name: 'Updated Car Name',
        price: 30000
      };

      const updatedCar = await updateCar(createdCar._id, updatedData);
      
      expect(updatedCar).toBeDefined();
      expect(updatedCar!.name).toBe(updatedData.name);
      expect(updatedCar!.price).toBe(updatedData.price);
      expect(updatedCar!.model).toBe(testCar.model); // Unchanged field
    });

    it('should delete car', async () => {
      await deleteCar(createdCar._id);
      
      const deletedCar = await Car.findById(createdCar._id);
      expect(deletedCar).toBeNull();
    });

    it('should return null for non-existent car id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const car = await getCarById(nonExistentId);
      
      expect(car).toBeNull();
    });
  });
}); 