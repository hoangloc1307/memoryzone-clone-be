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
// Get types
const getTypes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield prisma_1.default.productType.findMany();
    const responseData = types.map(type => ({ id: type.id, name: type.type }));
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy loại sản phẩm thành công', data: responseData });
});
// Add type
const addType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.body;
    const typeInDB = yield prisma_1.default.productType.findUnique({
        where: {
            type: type,
        },
        select: {
            id: true,
        },
    });
    if (!typeInDB) {
        yield prisma_1.default.productType.create({
            data: {
                type: type,
            },
        });
        (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Thêm loại sản phẩm thành công' });
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.BadRequest, 'Loại sản phẩm đã tồn tại', 'TYPE_ALREADY_EXISTS'));
    }
});
// Update type
const updateType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { type, attributes } = req.body;
    let connectOrCreateAttributes = [];
    let disconnectAttributes = [];
    if (attributes) {
        const res = yield prisma_1.default.productType.findUnique({
            where: {
                id: id,
            },
            select: {
                productAttributes: {
                    select: {
                        attribute: true,
                    },
                },
            },
        });
        const attributesInDB = (res === null || res === void 0 ? void 0 : res.productAttributes.map(item => item.attribute)) || [];
        connectOrCreateAttributes = attributes.reduce((result, current) => {
            if (!attributesInDB.includes(current)) {
                return [
                    ...result,
                    {
                        create: {
                            attribute: current,
                        },
                        where: {
                            attribute: current,
                        },
                    },
                ];
            }
            return [...result];
        }, []);
        disconnectAttributes = attributesInDB.reduce((result, current) => {
            if (!attributes.includes(current)) {
                return [
                    ...result,
                    {
                        attribute: current,
                    },
                ];
            }
            return [...result];
        }, []);
    }
    yield prisma_1.default.productType.update({
        where: {
            id: id,
        },
        data: {
            type: type,
            productAttributes: {
                connectOrCreate: connectOrCreateAttributes.length > 0 ? connectOrCreateAttributes : undefined,
                disconnect: disconnectAttributes.length > 0 ? disconnectAttributes : undefined,
            },
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Cập nhật loại sản phẩm thành công' });
});
// Delete type
const deleteType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield prisma_1.default.productType.delete({
        where: {
            id: id,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Xoá loại sản phẩm thành công' });
});
const typeController = {
    getTypes,
    addType,
    updateType,
    deleteType,
};
exports.default = typeController;
//# sourceMappingURL=type.controller.js.map