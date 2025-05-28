import Category from '../models/Category';

export const createCategory = async (categoryData: any) => {
  return await Category.create(categoryData);
};

export const getCategories = async () => {
  return await Category.find();
};

export const getCategoryById = async (id: string) => {
  return await Category.findById(id);
};

export const updateCategory = async (id: string, updateData: any) => {
  return await Category.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCategory = async (id: string) => {
  return await Category.findByIdAndDelete(id);
}; 