import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { jwtConfig } from '../configs/jwt'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { verifyToken } from '../utils/jwt'
import prismaClient from '../utils/prisma'

const dataRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email không được để trống')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email không đúng định dạng'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6, max: 32 })
    .withMessage('Mật khẩu phải từ 6-32 kí tự'),
]

const validatePayload = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    next()
  } else {
    const error = errors.array({ onlyFirstError: true }).reduce((result: any, item, index) => {
      result[item.param] = item.msg
      return result
    }, {})

    next(new AppError(STATUS.BadRequest, error))
  }
}

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
        next(new AppError(STATUS.BadRequest, 'Access token không tồn tại'))
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.BadRequest, 'Access token chưa được gửi'))
  }
}

const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.body.refresh_token
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
        next(new AppError(STATUS.BadRequest, 'Refresh token không tồn tại'))
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.BadRequest, 'Refresh token chưa được gửi'))
  }
}

const verifyOAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  const { provider, access_token, token_type } = req.body

  if (access_token) {
    try {
      switch (provider) {
        case 'github':
          const result = await axios.get('https://api.github.com/user', {
            headers: {
              Authorization: `${token_type} ${access_token}`,
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
    next(new AppError(STATUS.BadRequest, 'Token chưa được gửi'))
  }
}

const authMiddleware = {
  dataRules,
  validatePayload,
  verifyAccessToken,
  verifyRefreshToken,
  verifyOAuthToken,
}

export default authMiddleware
