"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = __importDefault(require("./error"));
const httpStatus_1 = require("../constants/httpStatus");
const signToken = (payload, secretKey, options) => {
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
};
exports.signToken = signToken;
const verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
            if (!err) {
                resolve(decoded);
            }
            else {
                if (err.name === 'TokenExpiredError') {
                    reject(new error_1.default(httpStatus_1.STATUS.Unauthorized, 'Token hết hạn', 'TOKEN_EXPIRED'));
                }
                else {
                    reject(new error_1.default(httpStatus_1.STATUS.Unauthorized, 'Token không đúng', 'TOKEN_ERROR'));
                }
            }
        });
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map