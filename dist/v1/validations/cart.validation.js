"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const addToCart = [
    (0, express_validator_1.body)('productId')
        .notEmpty()
        .withMessage('Không được để trống')
        .not()
        .isString()
        .withMessage('Phải là số')
        .isNumeric({ no_symbols: true })
        .withMessage('Không hợp lệ'),
];
const updateCart = [
    (0, express_validator_1.body)('productId')
        .notEmpty()
        .withMessage('Không được để trống')
        .not()
        .isString()
        .withMessage('Phải là số')
        .isNumeric({ no_symbols: true })
        .withMessage('Không hợp lệ'),
    (0, express_validator_1.body)('quantity')
        .not()
        .isString()
        .withMessage('Phải là số')
        .isInt({ min: 1, allow_leading_zeroes: false })
        .withMessage('Không hợp lệ'),
];
const deleteCard = [...addToCart];
const cartValidate = {
    addToCart,
    updateCart,
    deleteCard,
};
exports.default = cartValidate;
//# sourceMappingURL=cart.validation.js.map