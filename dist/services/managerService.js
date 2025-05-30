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
exports.deleteManager = exports.updateManager = exports.getManagerById = exports.getManagers = exports.createManager = void 0;
const Manager_1 = require("../models/Manager");
const createManager = (managerData) => __awaiter(void 0, void 0, void 0, function* () {
    const manager = new Manager_1.Manager(managerData);
    return yield manager.save();
});
exports.createManager = createManager;
const getManagers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const managers = yield Manager_1.Manager.find()
        .skip(skip)
        .limit(limit);
    const total = yield Manager_1.Manager.countDocuments();
    return {
        managers,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
});
exports.getManagers = getManagers;
const getManagerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Manager_1.Manager.findById(id);
});
exports.getManagerById = getManagerById;
const updateManager = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Manager_1.Manager.findByIdAndUpdate(id, updateData, { new: true });
});
exports.updateManager = updateManager;
const deleteManager = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Manager_1.Manager.findByIdAndDelete(id);
});
exports.deleteManager = deleteManager;
