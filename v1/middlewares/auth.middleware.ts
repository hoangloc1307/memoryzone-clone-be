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
        next(new AppError(STATUS.Unauthorized, 'Access token không tồn tại'))
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.Unauthorized, 'Access token chưa được gửi'))
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
        next(new AppError(STATUS.Unauthorized, 'Refresh token không tồn tại'))
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.Unauthorized, 'Refresh token chưa được gửi'))
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
    next(new AppError(STATUS.Unauthorized, 'Token chưa được gửi'))
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
          next(new AppError(STATUS.Unauthorized, 'Chưa được cấp quyền'))
        }
      } else {
        next(new AppError(STATUS.Unauthorized, 'Access token không tồn tại'))
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.Unauthorized, 'Access token chưa được gửi'))
  }
}

const authMiddleware = {
  verifyAccessToken,
  verifyRefreshToken,
  verifyOAuthToken,
  verifyAdmin,
}

export default authMiddleware
