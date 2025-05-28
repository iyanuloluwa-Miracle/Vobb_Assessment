import { Request, Response } from 'express';
import * as carService from '../services/carService';

export const createCar = async (req: Request, res: Response) => {
  try {
    const car = await carService.createCar(req.body);
    res.status(201).json(car);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getCars = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, brand, model, minPrice, maxPrice, available } = req.query;
    const filter: any = {};
    if (brand) filter.brand = brand;
    if (model) filter.model = model;
    if (available !== undefined) filter.available = available === 'true';
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    const result = await carService.getCars(filter, +page, +limit);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const car = await carService.updateCar(req.params.id, req.body);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const car = await carService.deleteCar(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}; 