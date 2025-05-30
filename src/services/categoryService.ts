import { Category, ICategory } from '../models/Category';

interface CategoryValidationError {
  field: string;
  message: string;
}

const validateCategory = (data: Partial<ICategory>): CategoryValidationError[] => {
  const errors: CategoryValidationError[] = [];

  // Validate name
  if (!data.name) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (typeof data.name !== 'string') {
    errors.push({ field: 'name', message: 'Name must be a string' });
  } else if (data.name.length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  } else if (data.name.length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  // Validate description
  if (!data.description) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (typeof data.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  } else if (data.description.length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters long' });
  } else if (data.description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  return errors;
};

export const createCategory = async (categoryData: Partial<ICategory>): Promise<ICategory> => {
  // Validate category data
  const validationErrors = validateCategory(categoryData);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
  }

  // Check if category with same name exists
  const existingCategory = await Category.findOne({ name: categoryData.name });
  if (existingCategory) {
    throw new Error('Category with this name already exists');
  }

  const category = new Category(categoryData);
  return category.save();
};

export const getCategories = async (page: number = 1, limit: number = 10): Promise<{ categories: ICategory[], total: number, page: number, totalPages: number }> => {
  // Validate pagination parameters
  if (page < 1) throw new Error('Page must be greater than 0');
  if (limit < 1) throw new Error('Limit must be greater than 0');
  if (limit > 100) throw new Error('Limit cannot exceed 100');

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
  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error('Invalid category ID format');
  }
  return Category.findById(id);
};

export const updateCategory = async (id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> => {
  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error('Invalid category ID format');
  }

  // Validate update data if provided
  if (Object.keys(categoryData).length > 0) {
    const validationErrors = validateCategory(categoryData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.map(err => `${err.field} - ${err.message}`).join(', ')}`);
    }
  }

  // If name is being updated, check for duplicates
  if (categoryData.name) {
    const existingCategory = await Category.findOne({ 
      name: categoryData.name,
      _id: { $ne: id }
    });
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, { new: true });
  if (!updatedCategory) {
    throw new Error('Category not found');
  }
  return updatedCategory;
};

export const deleteCategory = async (id: string): Promise<ICategory | null> => {
  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error('Invalid category ID format');
  }

  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    throw new Error('Category not found');
  }
  return deletedCategory;
}; 