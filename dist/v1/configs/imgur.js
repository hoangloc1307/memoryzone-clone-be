"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imgurConfig = void 0;
require('dotenv').config();
exports.imgurConfig = {
    Host: 'https://api.imgur.com',
    ClientId: process.env.IMGUR_CLIENT_ID,
    ClientSecret: process.env.IMGUR_CLIENT_SECRET,
    AccessToken: process.env.IMGUR_ACCESS_TOKEN,
    RefreshToken: process.env.IMGUR_REFRESH_TOKEN,
    AlbumProductsId: '46td1aG',
    AccountId: 166834321,
    Account: 'hoangloc1307',
};
//# sourceMappingURL=imgur.js.map