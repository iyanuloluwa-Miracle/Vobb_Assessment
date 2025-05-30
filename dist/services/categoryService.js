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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const Category_1 = require("../models/Category");
const createCategory = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const category = new Category_1.Category(categoryData);
    return category.save();
});
exports.createCategory = createCategory;
const getCategories = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [categories, total] = yield Promise.all([
        Category_1.Category.find().skip(skip).limit(limit),
        Category_1.Category.countDocuments()
    ]);
    return {
        categories,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
});
exports.getCategories = getCategories;
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Category_1.Category.findById(id);
});
exports.getCategoryById = getCategoryById;
const updateCategory = (id, categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    return Category_1.Category.findByIdAndUpdate(id, categoryData, { new: true });
});
exports.updateCategory = updateCategory;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Category_1.Category.findByIdAndDelete(id);
});
exports.deleteCategory = deleteCategory;
