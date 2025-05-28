import { Category, ICategory } from '../models/Category';

export const createCategory = async (categoryData: Partial<ICategory>): Promise<ICategory> => {
  const category = new Category(categoryData);
  return category.save();
};

export const getCategories = async (page: number = 1, limit: number = 10): Promise<{ categories: ICategory[], total: number, page: number, totalPages: number }> => {
  const skip = (page - 1) * limit;
  const [categories, total] = await Promise.all([
    Category.find().skip(skip).limit(limit),
    Category.countDocuments()
  ]);

  return {
    categories,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
  return Category.findById(id);
};

export const updateCategory = async (id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> => {
  return Category.findByIdAndUpdate(id, categoryData, { new: true });
};

export const deleteCategory = async (id: string): Promise<ICategory | null> => {
  return Category.findByIdAndDelete(id);
}; 