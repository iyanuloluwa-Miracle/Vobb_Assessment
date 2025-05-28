import { Car, ICar } from '../models/Car';

export const createCar = async (carData: Partial<ICar>) => {
  const car = new Car(carData);
  return await car.save();
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