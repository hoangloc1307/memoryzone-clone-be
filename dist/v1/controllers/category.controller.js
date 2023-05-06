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
const prisma_1 = __importDefault(require("../utils/prisma"));
const response_1 = require("../utils/response");
const httpStatus_1 = require("../constants/httpStatus");
const error_1 = __importDefault(require("../utils/error"));
// [GET] /category
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
    const responseData = categories.map(category => {
        return category.parentId === null ? Object.assign(Object.assign({}, category), { parentId: 0 }) : category;
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy danh mục thành công', data: responseData });
});
// [POST] /category
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, parentId, order } = req.body;
    const category = yield prisma_1.default.category.create({
        data: {
            name: name,
            parentId: parentId ? Number(parentId) : undefined,
            order: order ? Number(order) : undefined,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Thêm danh mục thành công', data: category });
});
// [PATCH] /category
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, parentId, order } = req.body;
    const id = Number(req.params.id);
    if (name || (parentId !== null && parentId !== undefined) || (order !== null && order !== undefined)) {
        const category = yield prisma_1.default.category.update({
            where: {
                id: id,
            },
            data: {
                name: name !== null && name !== void 0 ? name : undefined,
                parentId: parentId !== null && parentId !== void 0 ? parentId : undefined,
                order: order !== null && order !== void 0 ? order : undefined,
            },
        });
        (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Cập nhật danh mục thành công', data: category });
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.BadRequest, 'Không có dữ liệu để cập nhật', 'NO_DATA_TO_UPDATE'));
    }
});
// [DELETE] /category/:id
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const categoryChildren = yield prisma_1.default.category.findMany({
        where: {
            parentId: id,
        },
    });
    if (categoryChildren.length === 0) {
        const category = yield prisma_1.default.category.delete({
            where: {
                id: id,
            },
        });
        (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Xoá danh mục thành công', data: category });
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.BadRequest, 'Phải xoá các danh mục con trước', 'SUB_CATEGORIES_EXISTS'));
    }
});
const categoryController = {
    getProductCategories,
    addCategory,
    updateCategory,
    deleteCategory,
};
exports.default = categoryController;
//# sourceMappingURL=category.controller.js.map