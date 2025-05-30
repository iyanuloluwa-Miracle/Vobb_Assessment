import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const registerManager = async (req: Request, res: Response) => {
  try {
    const { manager } = await authService.registerManager(req.body);
    res.status(201).json({ manager });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginManager = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { manager, token } = await authService.loginManager(email, password);
    res.json({ manager, token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const registerCustomer = async (req: Request, res: Response) => {
  try {
    const { customer } = await authService.registerCustomer(req.body);
    res.status(201).json({ customer });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginCustomer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { customer, token } = await authService.loginCustomer(email, password);
    res.json({ customer, token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}; 