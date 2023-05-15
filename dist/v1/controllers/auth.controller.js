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
const hash_1 = require("../utils/hash");
const jwt_2 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../utils/prisma"));
const response_1 = require("../utils/response");
// Register
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    // Check email exists
    const existsEmail = yield prisma_1.default.account.findUnique({
        where: { email: email },
        select: { email: true },
    });
    if (!existsEmail) {
        // Hash password
        const passwordHash = yield (0, hash_1.hashPassword)(password);
        // Save account and create user
        yield prisma_1.default.account.create({
            data: {
                email: email,
                password: passwordHash,
                user: {
                    create: {
                        email: email,
                        name: name,
                    },
                },
            },
        });
        (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Đăng ký thành công' });
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.BadRequest, { email: 'Email đã được đăng ký trước đó' }, 'EMAIL_ALREADY_EXISTS'));
    }
});
// Login
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    // Check account email exists
    const account = yield prisma_1.default.account.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            status: true,
            password: true,
            role: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: {
                        select: {
                            link: true,
                        },
                    },
                },
            },
        },
    });
    if (account) {
        // Verify password
        const isPasswordRight = yield (0, hash_1.verifyPassword)(password, account.password);
        if (isPasswordRight) {
            if (account.status) {
                // Create payload
                const payload = {
                    id: account.user.id,
                    role: account.role,
                    name: account.user.name,
                    avatar: ((_a = account.user.avatar) === null || _a === void 0 ? void 0 : _a.link) || null,
                };
                // Generate token
                const accessToken = (0, jwt_2.signToken)(payload, jwt_1.jwtConfig.AccessTokenSecret, {
                    expiresIn: jwt_1.jwtConfig.AccessTokenExpiresTime,
                });
                const refreshToken = (0, jwt_2.signToken)(payload, jwt_1.jwtConfig.RefreshTokenSecret, {
                    expiresIn: jwt_1.jwtConfig.RefreshTokenExpiresTime,
                });
                // Update token in database
                yield prisma_1.default.token.upsert({
                    where: {
                        accountId: account.id,
                    },
                    create: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        accountId: account.id,
                    },
                    update: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    },
                });
                (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, {
                    message: 'Login thành công',
                    data: Object.assign(Object.assign({}, payload), { accessToken: accessToken, refreshToken: refreshToken }),
                });
            }
            else {
                next(new error_1.default(httpStatus_1.STATUS.Unauthorized, 'Tài khoản đang bị khoá', 'ACCOUNT_HAS_BEEN_BLOCKED'));
            }
        }
        else {
            next(new error_1.default(httpStatus_1.STATUS.Unauthorized, 'Sai mật khẩu', 'INCORRECT_PASSWORD'));
        }
    }
    else {
        next(new error_1.default(httpStatus_1.STATUS.Unauthorized, 'Email không tồn tại', 'EMAIL_NOT_EXISTS'));
    }
});
// Logout
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete token in database
    yield prisma_1.default.user.update({
        where: {
            id: req.jwtDecoded.id,
        },
        data: {
            account: {
                update: {
                    token: {
                        delete: true,
                    },
                },
            },
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Đăng xuất thành công' });
});
// Refresh token
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // Get account info
    const account = yield prisma_1.default.account.findUniqueOrThrow({
        where: { userId: req.jwtDecoded.id },
        select: {
            id: true,
            role: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: {
                        select: {
                            link: true,
                        },
                    },
                },
            },
        },
    });
    // Create payload
    const payload = {
        id: account.user.id,
        role: account.role,
        name: account.user.name,
        avatar: ((_b = account.user.avatar) === null || _b === void 0 ? void 0 : _b.link) || null,
    };
    // Generate new token and update to database
    const accessToken = (0, jwt_2.signToken)(payload, jwt_1.jwtConfig.AccessTokenSecret, {
        expiresIn: jwt_1.jwtConfig.AccessTokenExpiresTime,
    });
    const refreshToken = (0, jwt_2.signToken)(payload, jwt_1.jwtConfig.RefreshTokenSecret, {
        expiresIn: jwt_1.jwtConfig.RefreshTokenExpiresTime,
    });
    yield prisma_1.default.token.update({
        where: {
            accountId: account.id,
        },
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, {
        message: 'Refresh token thành công',
        data: { accessToken: accessToken, refreshToken: refreshToken },
    });
});
const authController = {
    register,
    login,
    logout,
    refreshToken,
};
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map