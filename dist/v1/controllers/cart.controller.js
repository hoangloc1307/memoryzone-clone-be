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
const response_1 = require("../utils/response");
const httpStatus_1 = require("../constants/httpStatus");
const prisma_1 = __importDefault(require("../utils/prisma"));
const error_1 = __importDefault(require("../utils/error"));
// [GET] /cart
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.jwtDecoded.id;
    const data = yield prisma_1.default.cart.findMany({
        where: {
            userId: userId,
        },
        select: {
            quantity: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    images: true,
                    price: true,
                    priceDiscount: true,
                    quantity: true,
                },
            },
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy giỏ hàng thành công', data: data });
});
// [POST] /cart
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const userId = req.jwtDecoded.id;
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: productId,
        },
    });
    if (product && Number(product.quantity) > 1) {
        const data = yield prisma_1.default.cart.upsert({
            where: {
                productId_userId: {
                    productId: productId,
                    userId: userId,
                },
            },
            create: {
                quantity: 1,
                productId: productId,
                userId: userId,
            },
            update: {
                quantity: {
                    increment: 1,
                },
            },
            select: {
                productId: true,
                quantity: true,
            },
        });
        (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Thêm sản phẩm vào giỏ hàng thành công', data: data });
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng', 'PRODUCT_NOT_AVAILABLE'));
    }
});
// [PATCH] /cart
const updateCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const userId = req.jwtDecoded.id;
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: productId,
        },
    });
    if (product && Number(product.quantity) > 1) {
        const availableQuantity = Number(product.quantity) < quantity ? Number(product.quantity) : quantity;
        const data = yield prisma_1.default.cart.update({
            where: {
                productId_userId: {
                    productId: productId,
                    userId: userId,
                },
            },
            data: {
                quantity: availableQuantity,
            },
            select: {
                productId: true,
                quantity: true,
            },
        });
        (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Cập nhật giỏ hàng thành công', data: data });
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng', 'PRODUCT_NOT_AVAILABLE'));
    }
});
// [DELETE] /cart
const deleteCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const userId = req.jwtDecoded.id;
    const data = yield prisma_1.default.cart.delete({
        where: {
            productId_userId: {
                productId: productId,
                userId: userId,
            },
        },
        select: {
            productId: true,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Xoá sản phẩm khỏi giỏ hàng thành công', data: data });
});
const cartController = {
    getCart,
    addToCart,
    updateCart,
    deleteCartItem,
};
exports.default = cartController;
//# sourceMappingURL=cart.controller.js.map