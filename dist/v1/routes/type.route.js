"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../utils/response");
const type_controller_1 = __importDefault(require("../controllers/type.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const typeRouter = (0, express_1.Router)();
typeRouter.get('/', (0, response_1.catchError)(type_controller_1.default.getTypes));
typeRouter.post('/', auth_middleware_1.default.verifyAdmin, (0, response_1.catchError)(type_controller_1.default.addType));
exports.default = typeRouter;
//# sourceMappingURL=type.route.js.map