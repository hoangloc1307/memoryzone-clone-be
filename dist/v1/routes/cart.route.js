"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const cart_validation_1 = __importDefault(require("../validations/cart.validation"));
const cart_controller_1 = __importDefault(require("../controllers/cart.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const response_1 = require("../utils/response");
const cartRouter = (0, express_1.Router)();
// Get cart info
cartRouter.get('/', (0, response_1.catchError)(auth_middleware_1.default.verifyAccessToken), (0, response_1.catchError)(cart_controller_1.default.getCart));
// Add to cart
cartRouter.post('/', (0, response_1.catchError)(auth_middleware_1.default.verifyAccessToken), cart_validation_1.default.addToCart, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(cart_controller_1.default.addToCart));
// Update cart item quantity
cartRouter.patch('/', (0, response_1.catchError)(auth_middleware_1.default.verifyAccessToken), cart_validation_1.default.updateCart, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(cart_controller_1.default.updateCart));
// Delete cart item
cartRouter.delete('/', (0, response_1.catchError)(auth_middleware_1.default.verifyAccessToken), cart_validation_1.default.deleteCard, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(cart_controller_1.default.deleteCartItem));
exports.default = cartRouter;
//# sourceMappingURL=cart.route.js.map