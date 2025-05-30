import { Car, ICar } from '../models/Car';

export const createCar = async (carData: Partial<ICar>) => {
  try {
    console.log('Validating car data:', JSON.stringify(carData, null, 2));
    
    // Validate required fields
    const requiredFields = ['brand', 'carModel', 'year', 'price', 'category'];
    const missingFields = requiredFields.filter(field => !carData[field as keyof Partial<ICar>]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const car = new Car(carData);
    console.log('Created car instance, about to save:', JSON.stringify(car, null, 2));
    
    const savedCar = await car.save();
    console.log('Car saved successfully:', JSON.stringify(savedCar, null, 2));
    
    return savedCar;
  } catch (error: any) {
    console.error('Error in createCar service:', {
      message: error.message,
      stack: error.stack,
      validationErrors: error.errors,
      carData
    });
    throw error; // Re-throw to be handled by controller
  }
};

export const getCars = async (filter: any = {}, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const cars = await Car.find(filter)
    .populate('category')
    .skip(skip)
    .limit(limit);
  const total = await Car.countDocuments(filter);
  return {
    cars,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getCarById = async (id: string) => {
  return await Car.findById(id).populate('category');
};

export const updateCar = async (id: string, carData: Partial<ICar>) => {
  return await Car.findByIdAndUpdate(id, carData, { new: true }).populate('category');
};

export const deleteCar = async (id: string) => {
  return await Car.findByIdAndDelete(id);
}; 