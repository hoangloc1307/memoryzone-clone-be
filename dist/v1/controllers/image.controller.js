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
const imgur_1 = require("../utils/imgur");
const prisma_1 = __importDefault(require("../utils/prisma"));
// [GET] /image
const getAlbums = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const albums = yield (0, imgur_1.imgurGetAlbums)();
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy albums thành công', data: albums });
});
// [GET] /image/:albumId
const getImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const albumId = req.params.albumId;
    const album = yield (0, imgur_1.imgurGetAlbumImages)(albumId);
    const images = album.data.images;
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Lấy hình ảnh thành công', data: images });
});
// [PATCH] /image/:id
const updateImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { alt } = req.body;
    const image = yield prisma_1.default.image.update({
        where: {
            id: id,
        },
        data: {
            alt: alt !== null && alt !== void 0 ? alt : undefined,
        },
        select: {
            id: true,
            alt: true,
        },
    });
    (0, response_1.responseSuccess)(res, httpStatus_1.STATUS.Ok, { message: 'Cập nhật hình ảnh thành công', data: image });
});
const imageController = { getAlbums, getImages, updateImage };
exports.default = imageController;
//# sourceMappingURL=image.controller.js.map