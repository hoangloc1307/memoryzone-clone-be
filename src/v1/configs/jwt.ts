require('dotenv').config()

export const jwtConfig = {
  AccessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
  RefreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
  AccessTokenExpiresTime: '1d',
  RefreshTokenExpiresTime: '30 days',
}
