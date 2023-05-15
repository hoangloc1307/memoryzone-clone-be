"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const login = [
    // Email
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email không được để trống')
        .normalizeEmail()
        .isEmail()
        .withMessage('Email không đúng định dạng'),
    // Password
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6, max: 32 })
        .withMessage('Mật khẩu phải từ 6-32 kí tự'),
];
const register = [
    ...login,
    // Name
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Tên không được để trống'),
];
const authValidate = {
    login,
    register,
};
exports.default = authValidate;
//# sourceMappingURL=auth.validation.js.map