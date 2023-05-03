"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const error_1 = __importDefault(require("../utils/error"));
const httpStatus_1 = require("../constants/httpStatus");
const validatePayload = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        next();
    }
    else {
        const error = errors.array({ onlyFirstError: true }).reduce((result, item) => {
            return Object.assign(Object.assign({}, result), { [item.path]: item.msg });
        }, {});
        next(new error_1.default(httpStatus_1.STATUS.BadRequest, error, 'PAYLOAD_ERROR'));
    }
};
const validationMiddleware = {
    validatePayload,
};
exports.default = validationMiddleware;
//# sourceMappingURL=validation.middleware.js.map