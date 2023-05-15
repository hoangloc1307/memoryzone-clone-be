"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const product_validation_1 = __importDefault(require("../validations/product.validation"));
const response_1 = require("../utils/response");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const productRouter = (0, express_1.Router)();
// GET
productRouter.get('/', product_validation_1.default.getProducts, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(product_controller_1.default.getProducts));
productRouter.get('/vendors', (0, response_1.catchError)(product_controller_1.default.getVendors));
productRouter.get('/attributes/:productTypeId', (0, response_1.catchError)(product_controller_1.default.getAttributes));
productRouter.get('/:id', (0, response_1.catchError)(product_controller_1.default.getProductById));
// POST
productRouter.post('/drafts', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), (0, response_1.catchError)(product_controller_1.default.addDraftProduct));
productRouter.post('/attributes/:productTypeId', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), product_validation_1.default.addProductAttributes, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(product_controller_1.default.addProductAttributes));
// PATCH
productRouter.patch('/images', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), product_validation_1.default.deleteProductImage, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(product_controller_1.default.deleteProductImage));
productRouter.patch('/:id', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), product_validation_1.default.updateProduct, upload_middleware_1.default.productImages, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(product_controller_1.default.updateProduct));
exports.default = productRouter;
//# sourceMappingURL=product.route.js.map