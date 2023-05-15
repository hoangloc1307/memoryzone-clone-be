"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../utils/response");
const feedback_controller_1 = __importDefault(require("../controllers/feedback.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const feedbackRouter = (0, express_1.Router)();
feedbackRouter.post('/:productId', (0, response_1.catchError)(auth_middleware_1.default.verifyAccessToken), (0, response_1.catchError)(feedback_controller_1.default.productFeedback));
exports.default = feedbackRouter;
//# sourceMappingURL=feedback.route.js.map