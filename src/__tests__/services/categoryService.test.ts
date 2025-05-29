import { Category } from '../../models/Category';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../../services/categoryService';
import mongoose from 'mongoose';

describe('Category Service', () => {
  const testCategory = {
    name: 'Test Category',
    description: 'Test Category Description',
    features: ['Feature 1', 'Feature 2', 'Feature 3']
  };

  describe('Category CRUD Operations', () => {
    let createdCategory: any;

    it('should create a new category', async () => {
      createdCategory = await createCategory(testCategory);

      expect(createdCategory).toBeDefined();
      expect(createdCategory.name).toBe(testCategory.name);
      expect(createdCategory.description).toBe(testCategory.description);
      expect(createdCategory.features).toEqual(testCategory.features);
    });

    it('should not create a category with existing name', async () => {
      await expect(createCategory(testCategory))
        .rejects
        .toThrow('Category with this name already exists');
    });

    it('should get all categories', async () => {
      const categories = await getCategories();
      
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0].name).toBe(testCategory.name);
    });

    it('should get category by id', async () => {
      const category = await getCategoryById(createdCategory._id);
      
      expect(category).toBeDefined();
      expect(category!.name).toBe(testCategory.name);
      expect(category!.description).toBe(testCategory.description);
    });

    it('should update category', async () => {
      const updatedData = {
        name: 'Updated Category Name',
        description: 'Updated Description'
      };

      const updatedCategory = await updateCategory(createdCategory._id, updatedData);
      
      expect(updatedCategory).toBeDefined();
      expect(updatedCategory!.name).toBe(updatedData.name);
      expect(updatedCategory!.description).toBe(updatedData.description);
      expect(updatedCategory!.features).toEqual(testCategory.features); // Unchanged field
    });

    it('should delete category', async () => {
      await deleteCategory(createdCategory._id);
      
      const deletedCategory = await Category.findById(createdCategory._id);
      expect(deletedCategory).toBeNull();
    });

    it('should return null for non-existent category id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const category = await getCategoryById(nonExistentId);
      
      expect(category).toBeNull();
    });
  });
}); 