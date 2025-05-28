import { Request, Response } from 'express';
import Manager from '../models/Manager';
import bcrypt from 'bcryptjs';

export const createManager = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const manager = await Manager.create({ name, email, password: hashedPassword });
    res.status(201).json(manager);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getManagers = async (req: Request, res: Response) => {
  try {
    const managers = await Manager.find();
    res.json(managers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getManagerById = async (req: Request, res: Response) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) return res.status(404).json({ error: 'Manager not found' });
    res.json(manager);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateManager = async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;
    let updateData = { ...rest };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const manager = await Manager.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!manager) return res.status(404).json({ error: 'Manager not found' });
    res.json(manager);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteManager = async (req: Request, res: Response) => {
  try {
    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) return res.status(404).json({ error: 'Manager not found' });
    res.json({ message: 'Manager deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 