import { Request, Response } from 'express';
import * as managerService from '../services/managerService';

export const createManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const manager = await managerService.createManager(req.body);
    res.status(201).json(manager);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create manager' });
  }
};

export const getManagers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await managerService.getManagers(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch managers' });
  }
};

export const getManagerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const manager = await managerService.getManagerById(req.params.id);
    if (!manager) {
      res.status(404).json({ error: 'Manager not found' });
      return;
    }
    res.json(manager);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch manager' });
  }
};

export const updateManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const manager = await managerService.updateManager(req.params.id, req.body);
    if (!manager) {
      res.status(404).json({ error: 'Manager not found' });
      return;
    }
    res.json(manager);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update manager' });
  }
};

export const deleteManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const manager = await managerService.deleteManager(req.params.id);
    if (!manager) {
      res.status(404).json({ error: 'Manager not found' });
      return;
    }
    res.json({ message: 'Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete manager' });
  }
}; 