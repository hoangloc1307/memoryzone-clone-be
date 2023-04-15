import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import { jwtConfig } from '../configs/jwt'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { verifyToken } from '../utils/jwt'
import prismaClient from '../utils/prisma'

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  if (accessToken) {
    try {
      const decoded = await verifyToken(accessToken, jwtConfig.AccessTokenSecret)
      const token = await prismaClient.token.findFirst({
        where: {
          accessToken: accessToken,
        },
      })
      if (token) {
        req.jwtDecoded = decoded
        next()
      } else {
        next(new AppError(STATUS.Unauthorized, 'Access token không tồn tại', 'ACCESS_TOKEN_NOT_EXISTS'))
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.Unauthorized, 'Access token chưa được gửi', 'ACCESS_TOKEN_HAS_NOT_BEEN_SENT'))
  }
}

const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    try {
      const decoded = await verifyToken(refreshToken, jwtConfig.RefreshTokenSecret)
      const token = await prismaClient.token.findFirst({
        where: {
          refreshToken: refreshToken,
        },
      })
      if (token) {
        req.jwtDecoded = decoded
        next()
      } else {
        next(new AppError(STATUS.BadRequest, 'Refresh token không tồn tại', 'REFRESH_TOKEN_NOT_EXISTS'))
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.BadRequest, 'Refresh token chưa được gửi', 'REFRESH_TOKEN_HAS_NOT_BEEN_SENT'))
  }
}

const verifyOAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  const { provider, accessToken } = req.body

  if (accessToken) {
    try {
      switch (provider) {
        case 'github':
          const result = await axios.get('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          if (result.status === 200) {
            req.data = result.data
            next()
          }
          break

        default:
          break
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.Unauthorized, 'Token chưa được gửi', 'TOKEN_HAS_NOT_BEEN_SENT'))
  }
}

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  if (accessToken) {
    try {
      const decoded = await verifyToken(accessToken, jwtConfig.AccessTokenSecret)
      const token = await prismaClient.token.findFirst({
        where: {
          accessToken: accessToken,
        },
      })
      if (token) {
        if (decoded.role === 'ADMIN') {
          req.jwtDecoded = decoded
          next()
        } else {
          next(new AppError(STATUS.Unauthorized, 'Chưa được cấp quyền', 'UNAUTHORIZED'))
        }
      } else {
        next(new AppError(STATUS.Unauthorized, 'Access token không tồn tại', 'ACCESS_TOKEN_NOT_EXISTS'))
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.Unauthorized, 'Access token chưa được gửi', 'ACCESS_TOKEN_HAS_NOT_BEEN_SENT'))
  }
}

const authMiddleware = {
  verifyAccessToken,
  verifyRefreshToken,
  verifyOAuthToken,
  verifyAdmin,
}

export default authMiddleware
