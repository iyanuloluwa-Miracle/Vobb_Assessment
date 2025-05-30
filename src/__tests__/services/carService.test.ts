import { Car, ICarDocument, ICar } from '../../models/Car';
import { Category } from '../../models/Category';
import { createCar, getCars, getCarById, updateCar, deleteCar } from '../../services/carService';
import mongoose from 'mongoose';

describe('Car Service', () => {
  let testCategory: any;
  let testCar: Partial<ICar>;

  beforeEach(async () => {
    // Clear previous test data
    await Car.deleteMany({});
    await Category.deleteMany({});

    // Create a test category
    testCategory = await Category.create({
      name: 'Test Category',
      description: 'Test Category Description'
    });

    // Prepare test car data
    testCar = {
      brand: 'Test Brand',
      carModel: 'Test Model',
      year: 2023,
      price: 25000,
      description: 'Test Description',
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      color: 'Black',
      vin: `TEST${Date.now()}${Math.random().toString(36).substring(7)}`, // Ensure unique VIN
      features: ['Feature 1', 'Feature 2'],
      images: ['image1.jpg', 'image2.jpg'],
      available: true
    };
  });

  describe('Car CRUD Operations', () => {
    it('should create a new car', async () => {
      const carData = { ...testCar, category: testCategory._id };
      const createdCar = await createCar(carData);

      expect(createdCar).toBeDefined();
      expect(createdCar.brand).toBe(testCar.brand);
      expect(createdCar.carModel).toBe(testCar.carModel);
      expect(createdCar.category.toString()).toBe(testCategory._id.toString());
    });

    it('should get all cars', async () => {
      // Create a test car first
      const carData = { ...testCar, category: testCategory._id };
      await createCar(carData);

      const result = await getCars();
      
      expect(Array.isArray(result.cars)).toBe(true);
      expect(result.cars.length).toBeGreaterThan(0);
      const firstCar = result.cars[0] as ICarDocument;
      expect(firstCar.brand).toBe(testCar.brand);
    });

    it('should get car by id', async () => {
      // Create a test car first
      const carData = { ...testCar, category: testCategory._id };
      const createdCar = await createCar(carData);

      const car = await getCarById(createdCar._id.toString());
      
      expect(car).toBeDefined();
      expect(car!.brand).toBe(testCar.brand);
      expect(car!.carModel).toBe(testCar.carModel);
    });

    it('should update car', async () => {
      // Create a test car first
      const carData = { ...testCar, category: testCategory._id };
      const createdCar = await createCar(carData);

      const updatedData = {
        brand: 'Updated Brand',
        price: 30000
      };

      const updatedCar = await updateCar(createdCar._id.toString(), updatedData);
      
      expect(updatedCar).toBeDefined();
      expect(updatedCar!.brand).toBe(updatedData.brand);
      expect(updatedCar!.price).toBe(updatedData.price);
      expect(updatedCar!.carModel).toBe(testCar.carModel); // Unchanged field
    });

    it('should delete car', async () => {
      // Create a test car first
      const carData = { ...testCar, category: testCategory._id };
      const createdCar = await createCar(carData);

      await deleteCar(createdCar._id.toString());
      
      const deletedCar = await Car.findById(createdCar._id);
      expect(deletedCar).toBeNull();
    });

    it('should return null for non-existent car id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const car = await getCarById(nonExistentId);
      
      expect(car).toBeNull();
    });
  });
}); 