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
const error_1 = __importDefault(require("../utils/error"));
const imgur_1 = require("../utils/imgur");
const prisma_1 = __importDefault(require("../utils/prisma"));
const response_1 = require("../utils/response");
// [GET] /products
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma_1.default.product.findMany({
        select: {
            id: true,
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
            name: true,
            price: true,
            priceDiscount: true,
            productType: {
                select: {
                    type: true,
                },
            },
        },
        orderBy: {
            id: 'desc',
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: products });
});
// [GET] /products/:id
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: Number(id),
        },
        select: {
            id: true,
            name: true,
            price: true,
            priceDiscount: true,
            quantity: true,
            vendor: true,
            shortInfo: true,
            description: true,
            slug: true,
            isDraft: true,
            isPublish: true,
            productType: {
                select: {
                    id: true,
                    type: true,
                    productAttributes: {
                        select: {
                            id: true,
                            attribute: true,
                        },
                    },
                },
            },
            productAttributes: {
                select: {
                    productAttributeId: true,
                    value: true,
                },
            },
            images: {
                select: {
                    id: true,
                    alt: true,
                    deleteHash: true,
                    name: true,
                    link: true,
                    order: true,
                },
            },
            categories: {
                select: {
                    id: true,
                    name: true,
                    order: true,
                    parentId: true,
                },
            },
        },
    });
    // Parse to array
    if (product) {
        product.shortInfo = JSON.parse(product.shortInfo);
    }
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: product });
});
// [GET] /products/vendors
const getProductVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield prisma_1.default.product.findMany({
        where: {
            vendor: {
                not: '',
            },
        },
        distinct: ['vendor'],
        select: {
            vendor: true,
        },
    });
    const data = vendors.reduce((result, current) => [...result, current.vendor], []);
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy thương hiệu thành công', data: data });
});
// [GET] /products/attributes
const getProductAttributes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productTypeId } = req.params;
    const attributes = yield prisma_1.default.productType.findUnique({
        where: {
            id: Number(productTypeId),
        },
        select: {
            productAttributes: {
                select: {
                    id: true,
                    attribute: true,
                },
            },
        },
    });
    const data = attributes === null || attributes === void 0 ? void 0 : attributes.productAttributes;
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy thuộc tính sản phẩm thành công', data: data });
});
// [GET] /products/types
const getProductTypes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield prisma_1.default.productType.findMany();
    // const data = vendors.reduce((result: string[], current) => [...result, current.vendor as string], [])
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy loại sản phẩm thành công', data: types });
});
// [POST] /products/attributes
const addProductAttributes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attributes } = req.body;
    const { productTypeId } = req.params;
    const attributeArray = attributes.reduce((result, current) => {
        return [...result, { create: { attribute: current }, where: { attribute: current } }];
    }, []);
    const data = yield prisma_1.default.productType.update({
        where: {
            id: Number(productTypeId),
        },
        data: {
            productAttributes: {
                connectOrCreate: attributeArray,
            },
        },
        include: {
            productAttributes: true,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Thêm thuộc tính thành công', data: data });
});
// [POST] /products/drafts
const addDraftProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.create({
        data: {},
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Tạo bản nháp sản phẩm thành công', data: product });
});
// [PATCH] /products/update
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const files = req.files;
    const { name, price, quantity, vendor, priceDiscount, description, shortInfo, typeId, isDraft, isPublish, slug, attributes, categories, } = req.body;
    let imagesCreateMany = [];
    if (files && files.length > 0) {
        const values = yield (0, imgur_1.imgurUpload)(files);
        imagesCreateMany = values.reduce((result, current) => {
            const data = current.data;
            return name
                ? [
                    ...result,
                    {
                        deleteHash: data.deletehash,
                        link: data.link,
                        name: data.name,
                        type: 'PRODUCT_IMAGE',
                        alt: name,
                    },
                ]
                : [
                    ...result,
                    {
                        deleteHash: data.deletehash,
                        link: data.link,
                        name: data.name,
                        type: 'PRODUCT_IMAGE',
                        alt: 'Product image',
                    },
                ];
        }, []);
    }
    const upsertArray = attributes
        ? attributes.reduce((result, current) => {
            if (current.value) {
                return [
                    ...result,
                    {
                        where: {
                            productId_productAttributeId: {
                                productAttributeId: Number(current.productAttributeId),
                                productId: id,
                            },
                        },
                        create: {
                            value: current.value,
                            productAttributeId: Number(current.productAttributeId),
                        },
                        update: {
                            value: current.value,
                        },
                    },
                ];
            }
            return [...result];
        }, [])
        : undefined;
    const connectCategories = (categories === null || categories === void 0 ? void 0 : categories.add) && categories.add.length > 0
        ? categories.add.map((item) => ({ id: Number(item) }))
        : undefined;
    const disconnectCategories = (categories === null || categories === void 0 ? void 0 : categories.delete) && categories.delete.length > 0
        ? categories.delete.map((item) => ({ id: Number(item) }))
        : undefined;
    const product = yield prisma_1.default.product.update({
        where: {
            id: id,
        },
        data: {
            name: name !== null && name !== void 0 ? name : undefined,
            price: price ? Number(price) : undefined,
            priceDiscount: priceDiscount ? Number(priceDiscount) : undefined,
            quantity: quantity ? Number(quantity) : undefined,
            shortInfo: shortInfo && shortInfo.length >= 0 ? JSON.stringify(shortInfo) : undefined,
            vendor: vendor !== null && vendor !== void 0 ? vendor : undefined,
            description: description !== null && description !== void 0 ? description : undefined,
            updatedAt: new Date().toISOString(),
            isDraft: isDraft !== null && isDraft !== void 0 ? isDraft : undefined,
            isPublish: isPublish !== null && isPublish !== void 0 ? isPublish : undefined,
            slug: slug !== null && slug !== void 0 ? slug : undefined,
            productType: typeId ? { connect: { id: Number(typeId) } } : undefined,
            productAttributes: attributes ? { upsert: upsertArray } : undefined,
            images: imagesCreateMany.length > 0 ? { createMany: { data: imagesCreateMany } } : undefined,
            categories: {
                connect: connectCategories,
                disconnect: disconnectCategories,
            },
        },
        select: {
            id: true,
            name: true,
            price: true,
            priceDiscount: true,
            quantity: true,
            vendor: true,
            shortInfo: true,
            description: true,
            slug: true,
            isDraft: true,
            isPublish: true,
            productType: {
                select: {
                    id: true,
                    type: true,
                    productAttributes: { select: { id: true, attribute: true } },
                },
            },
            productAttributes: {
                select: { productAttributeId: true, value: true },
            },
            images: {
                select: { id: true, alt: true, deleteHash: true, name: true, link: true, order: true },
            },
            categories: {
                select: { id: true, name: true, order: true, parentId: true },
            },
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Cập nhật sản phẩm thành công', data: product });
});
// [PATCH] /products/images
const deleteProductImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId, deleteHash } = req.body;
    const imgRes = yield (0, imgur_1.imgurDelete)(deleteHash);
    if (imgRes.success) {
        const image = yield prisma_1.default.image.delete({
            where: { id: imageId },
            select: {
                id: true,
                alt: true,
                deleteHash: true,
                name: true,
                link: true,
                order: true,
            },
        });
        (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Xoá hình ảnh thành công', data: image });
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.InternalServerError, 'Xoá hình ảnh thất bại', 'IMGUR_DELETE_FAIL'));
    }
});
const productController = {
    getProducts,
    getProductById,
    getProductVendors,
    getProductAttributes,
    getProductTypes,
    addProductAttributes,
    addDraftProduct,
    updateProduct,
    deleteProductImage,
};
exports.default = productController;
//# sourceMappingURL=product.controller.js.map