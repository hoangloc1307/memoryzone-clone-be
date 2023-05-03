"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
require('dotenv').config();
exports.jwtConfig = {
    AccessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    RefreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    AccessTokenExpiresTime: '30m',
    RefreshTokenExpiresTime: '1d',
};
//# sourceMappingURL=jwt.js.map