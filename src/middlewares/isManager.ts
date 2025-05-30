import { Request, Response, NextFunction } from 'express';

export const isManager = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (user && user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Manager role required.' });
  }
}; 