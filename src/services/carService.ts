import Car from '../models/Car';

export const createCar = async (carData: any) => {
  return await Car.create(carData);
};

export const getCars = async (filters: any, page: number, limit: number) => {
  const cars = await Car.find(filters)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('category');
  const total = await Car.countDocuments(filters);
  return { cars, total };
};

export const getCarById = async (id: string) => {
  return await Car.findById(id).populate('category');
};

export const updateCar = async (id: string, updateData: any) => {
  return await Car.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCar = async (id: string) => {
  return await Car.findByIdAndDelete(id);
}; 