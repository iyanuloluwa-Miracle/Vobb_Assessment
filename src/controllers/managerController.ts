import { Request, Response } from 'express';
import * as managerService from '../services/managerService';

export const createManager = async (req: Request, res: Response) => {
  try {
    const manager = await managerService.createManager(req.body);
    res.status(201).json(manager);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getManagers = async (req: Request, res: Response) => {
  try {
    const managers = await managerService.getManagers();
    res.json(managers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getManagerById = async (req: Request, res: Response) => {
  try {
    const manager = await managerService.getManagerById(req.params.id);
    if (!manager) return res.status(404).json({ error: 'Manager not found' });
    res.json(manager);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateManager = async (req: Request, res: Response) => {
  try {
    const manager = await managerService.updateManager(req.params.id, req.body);
    if (!manager) return res.status(404).json({ error: 'Manager not found' });
    res.json(manager);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteManager = async (req: Request, res: Response) => {
  try {
    const manager = await managerService.deleteManager(req.params.id);
    if (!manager) return res.status(404).json({ error: 'Manager not found' });
    res.json({ message: 'Manager deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}; 