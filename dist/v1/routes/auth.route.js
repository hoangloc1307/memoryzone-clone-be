"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const auth_validation_1 = __importDefault(require("../validations/auth.validation"));
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const response_1 = require("../utils/response");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', auth_validation_1.default.register, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(auth_controller_1.default.register));
authRouter.post('/login', auth_validation_1.default.login, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(auth_controller_1.default.login));
authRouter.patch('/refresh-token', auth_middleware_1.default.verifyRefreshToken, (0, response_1.catchError)(auth_controller_1.default.refreshToken));
authRouter.delete('/logout', auth_middleware_1.default.verifyAccessToken, (0, response_1.catchError)(auth_controller_1.default.logout));
// authRouter.post('/get-access-token', authMiddleware.verifyOAuthToken, catchError(authController.getAccessToken))
exports.default = authRouter;
//# sourceMappingURL=auth.route.js.map