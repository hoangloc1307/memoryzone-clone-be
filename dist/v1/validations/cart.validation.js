"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const addToCart = [
    (0, express_validator_1.body)('productId')
        .notEmpty()
        .withMessage('Không được để trống')
        .isInt({ min: 1 })
        .toInt()
        .withMessage('Phải là số nguyên lớn hơn 0'),
];
const updateCart = [
    (0, express_validator_1.body)('productId')
        .notEmpty()
        .withMessage('Không được để trống')
        .isInt({ min: 1 })
        .toInt()
        .withMessage('Phải là số nguyên lớn hơn 0'),
    (0, express_validator_1.body)('quantity')
        .notEmpty()
        .withMessage('Không được để trống')
        .isInt({ min: 1 })
        .toInt()
        .withMessage('Phải là số nguyên lớn hơn 0'),
];
const deleteCard = [
    (0, express_validator_1.body)('productId')
        .notEmpty()
        .withMessage('Không được để trống')
        .isInt({ min: 1 })
        .toInt()
        .withMessage('Phải là số nguyên lớn hơn 0'),
];
const cartValidate = {
    addToCart,
    updateCart,
    deleteCard,
};
exports.default = cartValidate;
//# sourceMappingURL=cart.validation.js.map