"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const response_1 = require("../utils/response");
const category_validation_1 = __importDefault(require("../validations/category.validation"));
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const categoryRouter = (0, express_1.Router)();
// Get all categories
categoryRouter.get('/', (0, response_1.catchError)(category_controller_1.default.getProductCategories));
// Add category
categoryRouter.post('/', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), category_validation_1.default.addCategory, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(category_controller_1.default.addCategory));
// Update category
categoryRouter.patch('/:id', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), category_validation_1.default.updateCategory, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(category_controller_1.default.updateCategory));
// Delete category
categoryRouter.delete('/:id', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), category_validation_1.default.deleteCategory, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(category_controller_1.default.deleteCategory));
exports.default = categoryRouter;
//# sourceMappingURL=category.route.js.map