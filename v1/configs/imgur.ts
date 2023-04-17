require('dotenv').config()

export const imgurConfig = {
  Host: 'https://api.imgur.com',
  ClientId: process.env.IMGUR_CLIENT_ID,
  ClientSecret: process.env.IMGUR_CLIENT_SECRET,
  AccessToken: process.env.IMGUR_ACCESS_TOKEN,
  RefreshToken: process.env.IMGUR_REFRESH_TOKEN,
  AlbumProductsId: '46td1aG',
}