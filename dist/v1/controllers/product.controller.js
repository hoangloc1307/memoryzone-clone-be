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
    const { limit, page, name } = req.query;
    const [totalRow, products] = yield prisma_1.default.$transaction([
        prisma_1.default.product.count({
            where: {
                name: {
                    contains: name ? String(name) : undefined,
                },
            },
        }),
        prisma_1.default.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                priceDiscount: true,
                quantity: true,
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
                userFeedbacks: {
                    select: {
                        rating: true,
                    },
                },
                productType: {
                    select: {
                        type: true,
                    },
                },
                categories: {
                    select: {
                        name: true,
                    },
                },
            },
            where: {
                name: {
                    contains: name ? String(name) : undefined,
                },
            },
            orderBy: {
                id: 'desc',
            },
            take: Number(limit) || undefined,
            skip: Number(limit) && Number(page) ? (Number(page) - 1) * Number(limit) : undefined,
        }),
    ]);
    const pagination = {
        limit: Number(limit),
        page: Number(page),
        total: totalRow,
    };
    const productResponse = products.map(product => {
        var _a, _b;
        return ({
            id: product.id,
            name: product.name,
            image: (_a = product.images[0]) === null || _a === void 0 ? void 0 : _a.link,
            price: product.price,
            priceDiscount: product.priceDiscount,
            type: (_b = product.productType) === null || _b === void 0 ? void 0 : _b.type,
            quantity: product.quantity,
            rating: product.userFeedbacks.reduce((acc, cur) => acc + cur.rating, 0) / product.userFeedbacks.length,
            categories: product.categories.map(item => item.name),
        });
    });
    const responseData = {
        pagination,
        products: productResponse,
    };
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: responseData });
});
// [GET] /products/:id
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const product = yield prisma_1.default.product.findUniqueOrThrow({
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
                },
            },
        },
    });
    const responseData = {
        id: product.id,
        name: product.name,
        price: product.price,
        priceDiscount: product.priceDiscount,
        quantity: product.quantity,
        vendor: product.vendor,
        shortInfo: JSON.parse(product.shortInfo),
        description: product.description,
        slug: product.slug,
        isDraft: product.isDraft,
        isPublish: product.isPublish,
        type: { id: (_a = product.productType) === null || _a === void 0 ? void 0 : _a.id, name: (_b = product.productType) === null || _b === void 0 ? void 0 : _b.type },
        attributes: product.productAttributes.reduce((result, current) => {
            return [...result, { id: current.productAttributeId, value: current.value }];
        }, []),
        images: product.images,
        categories: product.categories,
    };
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: responseData });
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
    const responseData = vendors.map(item => item.vendor);
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy thương hiệu thành công', data: responseData });
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
    const responseData = (attributes === null || attributes === void 0 ? void 0 : attributes.productAttributes.map(attr => ({
        id: attr.id,
        name: attr.attribute,
    }))) || [];
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy thuộc tính sản phẩm thành công', data: responseData });
});
// [GET] /products/types
const getProductTypes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield prisma_1.default.productType.findMany();
    const responseData = types.map(type => ({ id: type.id, name: type.type }));
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy loại sản phẩm thành công', data: responseData });
});
// [POST] /products/attributes
const addProductAttributes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attributes } = req.body;
    const { productTypeId } = req.params;
    const attributeArray = attributes.map((item) => ({
        create: { attribute: item },
        where: { attribute: item },
    }));
    yield prisma_1.default.productType.update({
        where: {
            id: Number(productTypeId),
        },
        data: {
            productAttributes: {
                connectOrCreate: attributeArray,
            },
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Thêm thuộc tính thành công' });
});
// [POST] /products/drafts
const addDraftProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.create({
        data: {},
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Tạo bản nháp sản phẩm thành công' });
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