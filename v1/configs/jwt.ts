require('dotenv').config()

export const jwtConfig = {
  AccessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
  RefreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
  AccessTokenExpiresTime: '30m',
  RefreshTokenExpiresTime: '1d',
}
