import { Category, ICategory } from '../../models/Category';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../../services/categoryService';
import mongoose from 'mongoose';

describe('Category Service', () => {
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  describe('Category CRUD Operations', () => {
    const testCategoryData = {
      name: 'Test Category',
      description: 'Test Category Description'
    };

    it('should create a new category', async () => {
      const createdCategory = await createCategory(testCategoryData);

      expect(createdCategory).toBeDefined();
      expect(createdCategory.name).toBe(testCategoryData.name);
      expect(createdCategory.description).toBe(testCategoryData.description);
    });

    it('should not create a category with existing name', async () => {
      // First create a category
      await createCategory(testCategoryData);

      // Try to create another category with the same name
      await expect(createCategory(testCategoryData))
        .rejects
        .toThrow('Category with this name already exists');
    });

    it('should get all categories', async () => {
      // First create a category
      await createCategory(testCategoryData);

      const categories = await getCategories();
      
      expect(Array.isArray(categories.categories)).toBe(true);
      expect(categories.categories.length).toBeGreaterThan(0);
      expect(categories.categories[0].name).toBe(testCategoryData.name);
    });

    it('should get category by id', async () => {
      // First create a category
      const createdCategory = await createCategory(testCategoryData);
      
      const category = await getCategoryById(createdCategory._id.toString());
      
      expect(category).toBeDefined();
      expect(category!.name).toBe(testCategoryData.name);
      expect(category!.description).toBe(testCategoryData.description);
    });

    it('should update category', async () => {
      // First create a category
      const createdCategory = await createCategory(testCategoryData);

      const updatedData = {
        name: 'Updated Category Name',
        description: 'Updated Description'
      };

      const updatedCategory = await updateCategory(createdCategory._id.toString(), updatedData);
      
      expect(updatedCategory).toBeDefined();
      expect(updatedCategory!.name).toBe(updatedData.name);
      expect(updatedCategory!.description).toBe(updatedData.description);
    });

    it('should delete category', async () => {
      // First create a category
      const createdCategory = await createCategory(testCategoryData);

      await deleteCategory(createdCategory._id.toString());
      
      const deletedCategory = await Category.findById(createdCategory._id);
      expect(deletedCategory).toBeNull();
    });

    it('should return null for non-existent category id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const category = await getCategoryById(nonExistentId);
      
      expect(category).toBeNull();
    });
  });
}); 