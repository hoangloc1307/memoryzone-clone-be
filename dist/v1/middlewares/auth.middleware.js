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
const jwt_1 = require("../configs/jwt");
const httpStatus_1 = require("../constants/httpStatus");
const error_1 = __importDefault(require("../utils/error"));
const jwt_2 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../utils/prisma"));
// Verify access token
const verifyAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (accessToken) {
        // Verify access token and find access token in database
        const [decoded, token] = yield Promise.all([
            (0, jwt_2.verifyToken)(accessToken, jwt_1.jwtConfig.AccessTokenSecret),
            prisma_1.default.token.findFirst({
                where: { accessToken: accessToken },
                select: { accessToken: true },
            }),
        ]);
        if (token) {
            req.jwtDecoded = decoded;
            next();
        }
        else {
            next(new error_1.default(httpStatus_1.STATUS.Unauthorized, 'Access token không tồn tại', 'ACCESS_TOKEN_DOES_NOT_EXISTS'));
        }
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.BadRequest, 'Access token chưa được gửi', 'ACCESS_TOKEN_HAS_NOT_BEEN_SENT'));
    }
});
// Verify refresh token
const verifyRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (refreshToken) {
        // Verify refresh token and find refresh token in database
        const [decoded, token] = yield Promise.all([
            (0, jwt_2.verifyToken)(refreshToken, jwt_1.jwtConfig.RefreshTokenSecret),
            prisma_1.default.token.findFirst({
                where: { refreshToken: refreshToken },
                select: { refreshToken: true },
            }),
        ]);
        if (token) {
            req.jwtDecoded = decoded;
            next();
        }
        else {
            next(new error_1.default(httpStatus_1.STATUS.Unauthorized, 'Refresh token không tồn tại', 'REFRESH_TOKEN_DOES_NOT_EXISTS'));
        }
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.BadRequest, 'Refresh token chưa được gửi', 'REFRESH_TOKEN_HAS_NOT_BEEN_SENT'));
    }
});
// Verify admin
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const accessToken = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    if (accessToken) {
        // Verify access token and find access token in database
        const [decoded, token] = yield Promise.all([
            (0, jwt_2.verifyToken)(accessToken, jwt_1.jwtConfig.AccessTokenSecret),
            prisma_1.default.token.findFirst({
                where: { accessToken: accessToken },
                select: { accessToken: true },
            }),
        ]);
        if (token) {
            if (decoded.role === 'ADMIN') {
                req.jwtDecoded = decoded;
                next();
            }
            else {
                next(new error_1.default(httpStatus_1.STATUS.Unauthorized, 'Chưa được cấp quyền', 'UNAUTHORIZED'));
            }
        }
        else {
            next(new error_1.default(httpStatus_1.STATUS.Unauthorized, 'Access token không tồn tại', 'ACCESS_TOKEN_DOES_NOT_EXISTS'));
        }
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.BadRequest, 'Access token chưa được gửi', 'ACCESS_TOKEN_HAS_NOT_BEEN_SENT'));
    }
});
const authMiddleware = {
    verifyAccessToken,
    verifyRefreshToken,
    verifyAdmin,
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map