"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = require("../../models/Category");
const categoryService_1 = require("../../services/categoryService");
const mongoose_1 = __importDefault(require("mongoose"));
describe('Category Service', () => {
    const testCategoryData = {
        name: 'Test Category',
        description: 'Test Category Description'
    };
    describe('Category CRUD Operations', () => {
        let createdCategory;
        it('should create a new category', () => __awaiter(void 0, void 0, void 0, function* () {
            createdCategory = yield (0, categoryService_1.createCategory)(testCategoryData);
            expect(createdCategory).toBeDefined();
            expect(createdCategory.name).toBe(testCategoryData.name);
            expect(createdCategory.description).toBe(testCategoryData.description);
        }));
        it('should not create a category with existing name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, categoryService_1.createCategory)(testCategoryData))
                .rejects
                .toThrow('Category with this name already exists');
        }));
        it('should get all categories', () => __awaiter(void 0, void 0, void 0, function* () {
            const categories = yield (0, categoryService_1.getCategories)();
            expect(Array.isArray(categories.categories)).toBe(true);
            expect(categories.categories.length).toBeGreaterThan(0);
            expect(categories.categories[0].name).toBe(testCategoryData.name);
        }));
        it('should get category by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const category = yield (0, categoryService_1.getCategoryById)(createdCategory._id.toString());
            expect(category).toBeDefined();
            expect(category.name).toBe(testCategoryData.name);
            expect(category.description).toBe(testCategoryData.description);
        }));
        it('should update category', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedData = {
                name: 'Updated Category Name',
                description: 'Updated Description'
            };
            const updatedCategory = yield (0, categoryService_1.updateCategory)(createdCategory._id.toString(), updatedData);
            expect(updatedCategory).toBeDefined();
            expect(updatedCategory.name).toBe(updatedData.name);
            expect(updatedCategory.description).toBe(updatedData.description);
        }));
        it('should delete category', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, categoryService_1.deleteCategory)(createdCategory._id.toString());
            const deletedCategory = yield Category_1.Category.findById(createdCategory._id);
            expect(deletedCategory).toBeNull();
        }));
        it('should return null for non-existent category id', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = new mongoose_1.default.Types.ObjectId().toString();
            const category = yield (0, categoryService_1.getCategoryById)(nonExistentId);
            expect(category).toBeNull();
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Category_1.Category.deleteMany({});
    }));
});
