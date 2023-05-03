"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imgurDelete = exports.imgurUpload = void 0;
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
const imgurDelete = (deleteHash) => {
    return imgurClient.deleteImage(deleteHash);
};
exports.imgurDelete = imgurDelete;
//# sourceMappingURL=imgur.js.map