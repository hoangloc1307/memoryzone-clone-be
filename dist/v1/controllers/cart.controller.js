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
                    images: {
                        select: {
                            link: true,
                            alt: true,
                        },
                        orderBy: {
                            id: 'asc',
                        },
                        take: 1,
                    },
                    price: true,
                    priceDiscount: true,
                    quantity: true,
                },
            },
        },
    });
    const responseData = data.map(item => ({
        id: item.product.id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.price,
        priceDiscount: item.product.priceDiscount,
        inStock: item.product.quantity,
        quantity: item.quantity,
    }));
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy giỏ hàng thành công', data: responseData });
});
// Add product to cart
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const userId = req.jwtDecoded.id;
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            quantity: true,
        },
    });
    if (product && product.quantity > 1) {
        yield prisma_1.default.cart.create({
            data: {
                quantity: 1,
                productId: productId,
                userId: userId,
            },
        });
        (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Thêm sản phẩm vào giỏ hàng thành công' });
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng', 'PRODUCT_NOT_AVAILABLE'));
    }
});
// Update cart item
const updateCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    const userId = req.jwtDecoded.id;
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            quantity: true,
        },
    });
    if (product && product.quantity > 1) {
        const availableQuantity = product.quantity < quantity ? product.quantity : quantity;
        yield prisma_1.default.cart.update({
            where: {
                productId_userId: {
                    productId: productId,
                    userId: userId,
                },
            },
            data: {
                quantity: availableQuantity,
            },
        });
        (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Cập nhật giỏ hàng thành công' });
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng', 'PRODUCT_NOT_AVAILABLE'));
    }
});
// Delete cart item
const deleteCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const userId = req.jwtDecoded.id;
    yield prisma_1.default.cart.delete({
        where: {
            productId_userId: {
                productId: productId,
                userId: userId,
            },
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Xoá sản phẩm khỏi giỏ hàng thành công' });
});
const cartController = {
    getCart,
    addToCart,
    updateCart,
    deleteCartItem,
};
exports.default = cartController;
//# sourceMappingURL=cart.controller.js.map