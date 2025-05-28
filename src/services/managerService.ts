import Manager from '../models/Manager';
import bcrypt from 'bcryptjs';

export const createManager = async (managerData: any) => {
  const { name, email, password } = managerData;
  const hashedPassword = await bcrypt.hash(password, 10);
  return await Manager.create({ name, email, password: hashedPassword });
};

export const getManagers = async () => {
  return await Manager.find();
};

export const getManagerById = async (id: string) => {
  return await Manager.findById(id);
};

export const updateManager = async (id: string, updateData: any) => {
  const { password, ...rest } = updateData;
  let data = { ...rest };
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }
  return await Manager.findByIdAndUpdate(id, data, { new: true });
};

export const deleteManager = async (id: string) => {
  return await Manager.findByIdAndDelete(id);
}; 