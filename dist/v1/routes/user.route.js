"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const response_1 = require("../utils/response");
const userRouter = (0, express_1.Router)();
// Get user info
userRouter.get('/', (0, response_1.catchError)(auth_middleware_1.default.verifyAccessToken), (0, response_1.catchError)(user_controller_1.default.getMe));
exports.default = userRouter;
//# sourceMappingURL=user.route.js.map