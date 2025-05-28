import { Request, Response } from 'express';
import Car from '../models/Car';

export const createCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (err) {
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
    const cars = await Car.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('category');
    const total = await Car.countDocuments(filter);
    res.json({ cars, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id).populate('category');
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 