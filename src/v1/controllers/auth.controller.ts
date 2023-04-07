import type { NextFunction, Request, Response } from 'express'
import { jwtConfig } from '../configs/jwt'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { hashPassword, verifyPassword } from '../utils/hash'
import { signToken } from '../utils/jwt'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  try {
    // Check email exists
    const existsEmail = await prismaClient.account.findFirst({
      where: {
        email: email,
      },
    })
    if (!existsEmail) {
      // Hash password
      const passwordHash = await hashPassword(password)
      // Save to dabatabase
      const account = await prismaClient.account.create({
        data: {
          email: email,
          password: passwordHash,
        },
      })
      // Response
      if (account) {
        responseSuccess(res, STATUS.Created, { message: 'Đăng ký thành công' })
      } else {
        next(new AppError(STATUS.InternalServerError, 'Đăng ký không thành công'))
      }
    } else {
      next(new AppError(STATUS.BadRequest, { email: 'Email đã tồn tại' }))
    }
  } catch (err) {
    next(err)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  try {
    // Check account email exists
    const account = await prismaClient.account.findFirst({
      where: {
        email: email,
      },
      include: {
        token: true,
      },
    })
    if (account) {
      // Check password right
      const isPasswordRight = await verifyPassword(password, account.password)
      if (isPasswordRight) {
        // Check account status
        if (account.status) {
          // Generate token and update to database
          const payload = {
            id: account.id,
            email: account.email,
            role: account.role,
          }

          const accessToken = signToken(payload, jwtConfig.AccessTokenSecret, {
            expiresIn: jwtConfig.AccessTokenExpiresTime,
          })
          const refreshToken = signToken(payload, jwtConfig.RefreshTokenSecret, {
            expiresIn: jwtConfig.RefreshTokenExpiresTime,
          })

          if (account.token) {
            await prismaClient.token.update({
              where: {
                accountId: account.id,
              },
              data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
              },
            })
          } else {
            await prismaClient.token.create({
              data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                accountId: account.id,
              },
            })
          }
          // Response
          responseSuccess(res, STATUS.Ok, {
            message: 'Login thành công',
            data: {
              ...payload,
              access_token: accessToken,
              refresh_token: refreshToken,
            },
          })
        } else {
          next(new AppError(STATUS.Unauthorized, 'Tài khoản đang bị khoá'))
        }
      } else {
        next(new AppError(STATUS.BadRequest, 'Sai mật khẩu'))
      }
    } else {
      next(new AppError(STATUS.BadRequest, 'Email không tồn tại'))
    }
  } catch (err) {
    next(err)
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Delete token in database
    await prismaClient.token.delete({
      where: {
        accountId: req.jwtDecoded.id,
      },
    })
    // Response
    responseSuccess(res, STATUS.Ok, { message: 'Đăng xuất thành công' })
  } catch (err) {
    next(err)
  }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get account info to create payload
    const account = await prismaClient.account.findFirst({
      where: {
        id: req.jwtDecoded.id,
      },
    })

    const payload = {
      id: account?.id,
      email: account?.email,
      role: account?.role,
    }

    // Generate new token and update to database
    const accessToken = signToken(payload, jwtConfig.AccessTokenSecret, {
      expiresIn: jwtConfig.AccessTokenExpiresTime,
    })
    const refreshToken = signToken(payload, jwtConfig.RefreshTokenSecret, {
      expiresIn: jwtConfig.RefreshTokenExpiresTime,
    })

    await prismaClient.token.update({
      where: {
        accountId: req.jwtDecoded.id,
      },
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    })

    // Response
    responseSuccess(res, STATUS.Ok, {
      message: 'Refresh token thành công',
      data: { access_token: accessToken, refresh_token: refreshToken },
    })
  } catch (err) {
    next(err)
  }
}

const authController = {
  register,
  login,
  logout,
  refreshToken,
}

export default authController
