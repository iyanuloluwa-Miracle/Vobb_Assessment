import { Manager, IManager } from '../models/Manager';
import bcrypt from 'bcryptjs';

export const createManager = async (managerData: Partial<IManager>) => {
  const manager = new Manager(managerData);
  return await manager.save();
};

export const getManagers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const managers = await Manager.find()
    .skip(skip)
    .limit(limit);
  const total = await Manager.countDocuments();
  return {
    managers,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getManagerById = async (id: string) => {
  return await Manager.findById(id);
};

export const updateManager = async (id: string, updateData: Partial<IManager>) => {
  return await Manager.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteManager = async (id: string) => {
  return await Manager.findByIdAndDelete(id);
}; 