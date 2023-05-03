"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const addCategory = [
    // Name
    (0, express_validator_1.body)('name').trim().notEmpty({ ignore_whitespace: true }).withMessage('Tên là bắt buộc'),
    // Parent id
    (0, express_validator_1.body)('parentId')
        .if((0, express_validator_1.body)('parentId').exists({ values: 'null' }))
        .isNumeric({ no_symbols: true })
        .withMessage('Phải là số'),
    // Order
    (0, express_validator_1.body)('order')
        .if((0, express_validator_1.body)('order').exists({ values: 'null' }))
        .isNumeric({ no_symbols: true })
        .withMessage('Phải là số'),
];
const updateCategory = [
    // Id
    (0, express_validator_1.param)('id').trim().isNumeric({ no_symbols: true }).withMessage('Phải là số'),
    // Name
    (0, express_validator_1.body)('name')
        .if((0, express_validator_1.body)('name').exists({ values: 'null' }))
        .trim(),
    // Parent id
    (0, express_validator_1.body)('parentId')
        .if((0, express_validator_1.body)('parentId').exists({ values: 'null' }))
        .isNumeric({ no_symbols: true })
        .withMessage('Phải là số'),
    // Order
    (0, express_validator_1.body)('order')
        .if((0, express_validator_1.body)('order').exists({ values: 'null' }))
        .isNumeric({ no_symbols: true })
        .withMessage('Phải là số'),
];
const deleteCategory = [(0, express_validator_1.param)('id').trim().isNumeric({ no_symbols: true }).withMessage('Phải là số')];
const categoryValidate = {
    addCategory,
    updateCategory,
    deleteCategory,
};
exports.default = categoryValidate;
//# sourceMappingURL=category.validation.js.map