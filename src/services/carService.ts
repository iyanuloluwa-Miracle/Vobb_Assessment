import { Car, ICar, ICarDocument } from '../models/Car';
import { ValidationError, validateMongoId, validatePrice, validateYear, validateVIN, validatePaginationParams } from '../utils/validations';

const validateCar = (data: Partial<ICar>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!data.brand) {
    errors.push({ field: 'brand', message: 'Brand is required' });
  } else if (typeof data.brand !== 'string' || data.brand.length < 2 || data.brand.length > 50) {
    errors.push({ field: 'brand', message: 'Brand must be between 2 and 50 characters' });
  }

  if (!data.carModel) {
    errors.push({ field: 'carModel', message: 'Model is required' });
  } else if (typeof data.carModel !== 'string' || data.carModel.length < 1 || data.carModel.length > 50) {
    errors.push({ field: 'carModel', message: 'Model must be between 1 and 50 characters' });
  }

  if (!data.year) {
    errors.push({ field: 'year', message: 'Year is required' });
  } else if (!validateYear(data.year)) {
    errors.push({ field: 'year', message: 'Invalid year' });
  }

  if (!data.price) {
    errors.push({ field: 'price', message: 'Price is required' });
  } else if (!validatePrice(data.price)) {
    errors.push({ field: 'price', message: 'Invalid price' });
  }

  if (!data.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  } else if (!validateMongoId(data.category.toString())) {
    errors.push({ field: 'category', message: 'Invalid category ID' });
  }

  if (data.vin && !validateVIN(data.vin)) {
    errors.push({ field: 'vin', message: 'Invalid VIN format' });
  }

  if (data.description && (typeof data.description !== 'string' || data.description.length > 1000)) {
    errors.push({ field: 'description', message: 'Description cannot exceed 1000 characters' });
  }

  if (data.mileage !== undefined && (isNaN(data.mileage) || data.mileage < 0)) {
    errors.push({ field: 'mileage', message: 'Mileage must be a positive number' });
  }

  if (data.images) {
    if (!Array.isArray(data.images)) {
      errors.push({ field: 'images', message: 'Images must be an array' });
    } else {
      data.images.forEach((url, index) => {
        if (typeof url !== 'string' || url.length === 0) {
          errors.push({ field: 'images', message: `Invalid image URL at position ${index}` });
        }
      });
    }
  }

  return errors;
};

export const createCar = async (carData: Partial<ICar>): Promise<ICarDocument> => {
  // Validate car data
  const validationErrors = validateCar(carData);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
  }

  // Check if VIN exists (if provided)
  if (carData.vin) {
    const existingCar = await Car.findOne({ vin: carData.vin });
    if (existingCar) {
      throw new Error('Car with this VIN already exists');
    }
  }

  const car = new Car(carData);
  return car.save();
};

export const getCars = async (page: number = 1, limit: number = 10): Promise<{ cars: ICarDocument[], total: number, page: number, totalPages: number }> => {
  const paginationErrors = validatePaginationParams(page, limit);
  if (paginationErrors.length > 0) {
    throw new Error(`Validation failed: ${paginationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
  }

  const skip = (page - 1) * limit;
  const [cars, total] = await Promise.all([
    Car.find().skip(skip).limit(limit),
    Car.countDocuments()
  ]);

  return {
    cars,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getCarById = async (id: string): Promise<ICarDocument | null> => {
  if (!validateMongoId(id)) {
    throw new Error('Invalid car ID format');
  }
  return Car.findById(id);
};

export const updateCar = async (id: string, carData: Partial<ICar>): Promise<ICarDocument | null> => {
  if (!validateMongoId(id)) {
    throw new Error('Invalid car ID format');
  }

  // Validate update data if provided
  if (Object.keys(carData).length > 0) {
    const validationErrors = validateCar(carData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
    }
  }

  // Check if VIN exists (if being updated)
  if (carData.vin) {
    const existingCar = await Car.findOne({ vin: carData.vin, _id: { $ne: id } });
    if (existingCar) {
      throw new Error('Car with this VIN already exists');
    }
  }

  const updatedCar = await Car.findByIdAndUpdate(id, carData, { new: true });
  if (!updatedCar) {
    throw new Error('Car not found');
  }
  return updatedCar;
};

export const deleteCar = async (id: string): Promise<ICarDocument | null> => {
  if (!validateMongoId(id)) {
    throw new Error('Invalid car ID format');
  }

  const deletedCar = await Car.findByIdAndDelete(id);
  if (!deletedCar) {
    throw new Error('Car not found');
  }
  return deletedCar;
}; 