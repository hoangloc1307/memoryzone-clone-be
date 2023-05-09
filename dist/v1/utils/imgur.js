"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imgurGetAlbumImages = exports.imgurGetAlbums = exports.imgurDelete = exports.imgurUpload = void 0;
const imgur_1 = require("imgur");
const imgur_2 = require("../configs/imgur");
const imgurClient = new imgur_1.ImgurClient({
    clientId: imgur_2.imgurConfig.ClientId,
    clientSecret: imgur_2.imgurConfig.ClientSecret,
    refreshToken: imgur_2.imgurConfig.RefreshToken,
});
const imgurUpload = (images) => {
    const promiseArr = [];
    images.forEach(image => {
        promiseArr.push(imgurClient.upload({
            image: image.buffer,
            type: 'stream',
            album: imgur_2.imgurConfig.AlbumProductsId,
            name: image.originalname,
        }));
    });
    return Promise.all(promiseArr);
};
exports.imgurUpload = imgurUpload;
const imgurDelete = (deleteHashs) => {
    const promiseArr = [];
    deleteHashs.forEach(imageHash => {
        promiseArr.push(imgurClient.deleteImage(imageHash));
    });
    return Promise.all(promiseArr);
};
exports.imgurDelete = imgurDelete;
const imgurGetAlbums = () => {
    return imgurClient.getAlbums(imgur_2.imgurConfig.Account);
};
exports.imgurGetAlbums = imgurGetAlbums;
const imgurGetAlbumImages = (albumId) => {
    return imgurClient.getAlbum(albumId);
};
exports.imgurGetAlbumImages = imgurGetAlbumImages;
//# sourceMappingURL=imgur.js.map