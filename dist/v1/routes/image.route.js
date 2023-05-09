"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const response_1 = require("../utils/response");
const image_controller_1 = __importDefault(require("../controllers/image.controller"));
const imageRouter = (0, express_1.Router)();
imageRouter.get('/', auth_middleware_1.default.verifyAdmin, (0, response_1.catchError)(image_controller_1.default.getAlbums));
imageRouter.get('/:albumId', auth_middleware_1.default.verifyAdmin, (0, response_1.catchError)(image_controller_1.default.getImages));
imageRouter.patch('/:id', auth_middleware_1.default.verifyAdmin, (0, response_1.catchError)(image_controller_1.default.updateImage));
exports.default = imageRouter;
//# sourceMappingURL=image.route.js.map