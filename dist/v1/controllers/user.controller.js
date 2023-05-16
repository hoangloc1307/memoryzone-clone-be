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
const response_1 = require("../utils/response");
const httpStatus_1 = require("../constants/httpStatus");
const prisma_1 = __importDefault(require("../utils/prisma"));
// Get user info
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: req.jwtDecoded.id,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy thông tin thành công', data: user });
});
const userController = { getMe };
exports.default = userController;
//# sourceMappingURL=user.controller.js.map