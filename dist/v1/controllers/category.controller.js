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
const httpStatus_1 = require("../constants/httpStatus");
const prisma_1 = __importDefault(require("../utils/prisma"));
const response_1 = require("../utils/response");
// Get all categories
const getProductCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        orderBy: [
            {
                parentId: 'asc',
            },
            {
                order: 'asc',
            },
            {
                name: 'asc',
            },
        ],
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy danh mục thành công', data: categories });
});
// Add category
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, parentId, order } = req.body;
    yield prisma_1.default.category.create({
        data: {
            name: name,
            parentId: Number(parentId) || 0,
            order: Number(order) || 0,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Thêm danh mục thành công' });
});
// Update category
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { name, parentId, order } = req.body;
    yield prisma_1.default.category.update({
        where: {
            id: id,
        },
        data: {
            name: name !== null && name !== void 0 ? name : undefined,
            parentId: parentId !== null && parentId !== void 0 ? parentId : undefined,
            order: order !== null && order !== void 0 ? order : undefined,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Cập nhật danh mục thành công' });
});
// Delete category
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const categoryChildren = yield prisma_1.default.category.findMany({
            where: {
                parentId: id,
            },
        });
        yield Promise.all(categoryChildren.map(child => deleteCategory(child.id)));
        yield prisma_1.default.category.delete({
            where: {
                id: id,
            },
        });
    });
    yield deleteCategory(id);
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Xoá danh mục thành công' });
});
const categoryController = {
    getProductCategories,
    addCategory,
    updateCategory,
    deleteCategory,
};
exports.default = categoryController;
//# sourceMappingURL=category.controller.js.map