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
const productFeedback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const userId = req.jwtDecoded.id;
    const { comment, rating } = req.body;
    yield prisma_1.default.feedback.create({
        data: {
            rating: rating,
            comment: comment,
            productId: Number(productId),
            userId: userId,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Created, { message: 'Phản hồi thành công' });
});
const feedbackController = { productFeedback };
exports.default = feedbackController;
//# sourceMappingURL=feedback.controller.js.map