import { Request, Response } from 'express';
import * as carService from '../services/carService';

export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await carService.createCar(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create car' });
  }
};

export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, brand, carModel, minPrice, maxPrice, available } = req.query;
    const filter: any = {};
    if (brand) filter.brand = brand;
    if (carModel) filter.carModel = carModel;
    if (available !== undefined) filter.available = available === 'true';
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    const result = await carService.getCars(filter, +page, +limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

export const getCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

export const updateCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await carService.updateCar(req.params.id, req.body);
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    res.json(car);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update car' });
  }
};

export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await carService.deleteCar(req.params.id);
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
}; 