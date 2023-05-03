"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const productImages = upload.array('images[]', 10);
const uploadMiddleware = {
    productImages,
};
exports.default = uploadMiddleware;
//# sourceMappingURL=upload.middleware.js.map