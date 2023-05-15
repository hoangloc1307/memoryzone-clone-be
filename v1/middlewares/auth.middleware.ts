import { NextFunction, Request, Response } from 'express'
import { jwtConfig } from '../configs/jwt'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { verifyToken } from '../utils/jwt'
import prismaClient from '../utils/prisma'

// Verify access token
const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]

  if (accessToken) {
    // Verify access token and find access token in database
    const [decoded, token] = await Promise.all([
      verifyToken(accessToken, jwtConfig.AccessTokenSecret),
      prismaClient.token.findFirst({
        where: { accessToken: accessToken },
        select: { accessToken: true },
      }),
    ])

    if (token) {
      req.jwtDecoded = decoded
      next()
    } else {
      next(new AppError(STATUS.Unauthorized, 'Access token không tồn tại', 'ACCESS_TOKEN_DOES_NOT_EXISTS'))
    }
  } else {
    next(new AppError(STATUS.BadRequest, 'Access token chưa được gửi', 'ACCESS_TOKEN_HAS_NOT_BEEN_SENT'))
  }
}

// Verify refresh token
const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body

  if (refreshToken) {
    // Verify refresh token and find refresh token in database
    const [decoded, token] = await Promise.all([
      verifyToken(refreshToken, jwtConfig.RefreshTokenSecret),
      prismaClient.token.findFirst({
        where: { refreshToken: refreshToken },
        select: { refreshToken: true },
      }),
    ])

    if (token) {
      req.jwtDecoded = decoded
      next()
    } else {
      next(new AppError(STATUS.Unauthorized, 'Refresh token không tồn tại', 'REFRESH_TOKEN_DOES_NOT_EXISTS'))
    }
  } else {
    next(new AppError(STATUS.BadRequest, 'Refresh token chưa được gửi', 'REFRESH_TOKEN_HAS_NOT_BEEN_SENT'))
  }
}

// Verify admin
const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]

  if (accessToken) {
    // Verify access token and find access token in database
    const [decoded, token] = await Promise.all([
      verifyToken(accessToken, jwtConfig.AccessTokenSecret),
      prismaClient.token.findFirst({
        where: { accessToken: accessToken },
        select: { accessToken: true },
      }),
    ])

    if (token) {
      if (decoded.role === 'ADMIN') {
        req.jwtDecoded = decoded
        next()
      } else {
        next(new AppError(STATUS.Unauthorized, 'Chưa được cấp quyền', 'UNAUTHORIZED'))
      }
    } else {
      next(new AppError(STATUS.Unauthorized, 'Access token không tồn tại', 'ACCESS_TOKEN_DOES_NOT_EXISTS'))
    }
  } else {
    next(new AppError(STATUS.BadRequest, 'Access token chưa được gửi', 'ACCESS_TOKEN_HAS_NOT_BEEN_SENT'))
  }
}

const authMiddleware = {
  verifyAccessToken,
  verifyRefreshToken,
  verifyAdmin,
}

export default authMiddleware
