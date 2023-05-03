"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const updateProduct = [
    // Name
    (0, express_validator_1.body)('name')
        .if((0, express_validator_1.body)('name').exists({ values: 'null' }))
        .trim(),
    // Price
    (0, express_validator_1.body)('price')
        .if((0, express_validator_1.body)('price').exists({ values: 'null' }))
        .isNumeric({ no_symbols: true })
        .withMessage('Phải là số lớn hơn hoặc bằng 0'),
    // Price discount
    (0, express_validator_1.body)('priceDiscount')
        .if((0, express_validator_1.body)('priceDiscount').exists({ values: 'null' }))
        .isNumeric({ no_symbols: true })
        .withMessage('Phải là số lớn hơn hoặc bằng 0'),
    // Quantity
    (0, express_validator_1.body)('quantity')
        .if((0, express_validator_1.body)('quantity').exists({ values: 'null' }))
        .isInt({ allow_leading_zeroes: false, min: -1 })
        .withMessage('Phải là số lớn hơn hoặc bằng -1'),
    // Short info
    (0, express_validator_1.body)('shortInfo')
        .if((0, express_validator_1.body)('shortInfo').exists({ values: 'null' }))
        .isArray()
        .withMessage('Phải là mảng'),
    // Vendor
    (0, express_validator_1.body)('vendor')
        .if((0, express_validator_1.body)('vendor').exists({ values: 'null' }))
        .trim(),
    // Description
    (0, express_validator_1.body)('description')
        .if((0, express_validator_1.body)('description').exists({ values: 'null' }))
        .trim(),
    // Type id
    (0, express_validator_1.body)('typeId')
        .if((0, express_validator_1.body)('typeId').exists({ values: 'null' }))
        .isNumeric({ no_symbols: true })
        .withMessage('Không hợp lệ'),
    // Draft
    (0, express_validator_1.body)('isDraft')
        .if((0, express_validator_1.body)('isDraft').exists({ values: 'null' }))
        .isBoolean({ strict: true })
        .withMessage('Không hợp lệ'),
    // Publish
    (0, express_validator_1.body)('isPublish')
        .if((0, express_validator_1.body)('isPublish').exists({ values: 'null' }))
        .isBoolean({ strict: true })
        .withMessage('Không hợp lệ'),
    // Slug
    (0, express_validator_1.body)('slug')
        .if((0, express_validator_1.body)('slug').exists({ values: 'null' }))
        .trim(),
    // Attributes
    (0, express_validator_1.body)('attributes')
        .if((0, express_validator_1.body)('attributes').exists({ values: 'null' }))
        .isArray()
        .withMessage('Phải là mảng'),
    // Categories
    (0, express_validator_1.body)('categories')
        .if((0, express_validator_1.body)('categories').exists({ values: 'null' }))
        .isObject()
        .withMessage('Phải là object'),
];
const addProductAttributes = [
    (0, express_validator_1.body)('attributes').isArray({ min: 1 }).withMessage('Phải là mảng và có ít nhất 1 giá trị'),
];
const deleteProductImage = [
    (0, express_validator_1.body)('imageId')
        .notEmpty()
        .withMessage('Không được để trống')
        .not()
        .isString()
        .withMessage('Phải là số')
        .isNumeric({ no_symbols: true })
        .withMessage('Không hợp lệ'),
    (0, express_validator_1.body)('deleteHash').notEmpty().withMessage('Không được để trống'),
];
const productValidate = {
    updateProduct,
    deleteProductImage,
    addProductAttributes,
};
exports.default = productValidate;
//# sourceMappingURL=product.validation.js.map