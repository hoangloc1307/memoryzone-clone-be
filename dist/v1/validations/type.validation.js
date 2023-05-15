"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const addType = [
    // Name
    (0, express_validator_1.body)('name').trim().notEmpty({ ignore_whitespace: true }).withMessage('Tên là bắt buộc'),
];
const updateType = [
    // Id
    (0, express_validator_1.param)('id').trim().isNumeric({ no_symbols: true }).withMessage('Phải là số'),
    // Type
    (0, express_validator_1.body)('type')
        .if((0, express_validator_1.body)('type').exists({ values: 'null' }))
        .trim(),
    // Attributes
    (0, express_validator_1.body)('attributes')
        .if((0, express_validator_1.body)('attributes').exists({ values: 'null' }))
        .isArray()
        .withMessage('Phải là mảng'),
];
const deleteType = [(0, express_validator_1.param)('id').trim().isNumeric({ no_symbols: true }).withMessage('Phải là số')];
const typeValidate = {
    addType,
    updateType,
    deleteType,
};
exports.default = typeValidate;
//# sourceMappingURL=type.validation.js.map