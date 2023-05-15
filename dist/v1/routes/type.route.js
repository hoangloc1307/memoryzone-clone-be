"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../utils/response");
const type_controller_1 = __importDefault(require("../controllers/type.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const type_validation_1 = __importDefault(require("../validations/type.validation"));
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const typeRouter = (0, express_1.Router)();
// Get all types
typeRouter.get('/', (0, response_1.catchError)(type_controller_1.default.getTypes));
// Add new type
typeRouter.post('/', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), type_validation_1.default.addType, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(type_controller_1.default.addType));
// Update type
typeRouter.patch('/:id', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), type_validation_1.default.updateType, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(type_controller_1.default.updateType));
// Delete type
typeRouter.delete('/:id', (0, response_1.catchError)(auth_middleware_1.default.verifyAdmin), type_validation_1.default.deleteType, validation_middleware_1.default.validatePayload, (0, response_1.catchError)(type_controller_1.default.deleteType));
exports.default = typeRouter;
//# sourceMappingURL=type.route.js.map