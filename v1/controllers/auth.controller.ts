import { NextFunction, Request, Response, response } from 'express'
import { jwtConfig } from '../configs/jwt'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { hashPassword, verifyPassword } from '../utils/hash'
import { signToken } from '../utils/jwt'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'

// Register
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body

  // Check email exists
  const existsEmail = await prismaClient.account.findUnique({
    where: { email: email },
    select: { email: true },
  })

  if (!existsEmail) {
    // Hash password
    const passwordHash = await hashPassword(password)

    // Save account and create user
    await prismaClient.account.create({
      data: {
        email: email,
        password: passwordHash,
        user: {
          create: {
            email: email,
            name: name,
          },
        },
      },
    })

    responseSuccess(res, STATUS.Created, { message: 'Đăng ký thành công' })
  } else {
    next(new AppError(STATUS.BadRequest, { email: 'Email đã được đăng ký trước đó' }, 'EMAIL_ALREADY_EXISTS'))
  }
}

// Login
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  // Check account email exists
  const account = await prismaClient.account.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      status: true,
      password: true,
      role: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: {
            select: {
              link: true,
            },
          },
        },
      },
    },
  })

  if (account) {
    // Verify password
    const isPasswordRight = await verifyPassword(password, account.password)

    if (isPasswordRight) {
      if (account.status) {
        // Create payload
        const payload = {
          id: account.user.id,
          role: account.role,
          name: account.user.name,
          avatar: account.user.avatar?.link || null,
        }

        // Generate token
        const accessToken = signToken(payload, jwtConfig.AccessTokenSecret, {
          expiresIn: jwtConfig.AccessTokenExpiresTime,
        })
        const refreshToken = signToken(payload, jwtConfig.RefreshTokenSecret, {
          expiresIn: jwtConfig.RefreshTokenExpiresTime,
        })

        // Update token in database
        await prismaClient.token.upsert({
          where: {
            accountId: account.id,
          },
          create: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            accountId: account.id,
          },
          update: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        })

        responseSuccess(res, STATUS.Ok, {
          message: 'Login thành công',
          data: {
            ...payload,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        })
      } else {
        next(new AppError(STATUS.Unauthorized, 'Tài khoản đang bị khoá', 'ACCOUNT_HAS_BEEN_BLOCKED'))
      }
    } else {
      next(new AppError(STATUS.Unauthorized, 'Sai mật khẩu', 'INCORRECT_PASSWORD'))
    }
  } else {
    next(new AppError(STATUS.Unauthorized, 'Email không tồn tại', 'EMAIL_NOT_EXISTS'))
  }
}

// Logout
const logout = async (req: Request, res: Response, next: NextFunction) => {
  // Delete token in database
  await prismaClient.user.update({
    where: {
      id: req.jwtDecoded.id,
    },
    data: {
      account: {
        update: {
          token: {
            delete: true,
          },
        },
      },
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Đăng xuất thành công' })
}

// Refresh token
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  // Get account info
  const account = await prismaClient.account.findUniqueOrThrow({
    where: { userId: req.jwtDecoded.id },
    select: {
      id: true,
      role: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: {
            select: {
              link: true,
            },
          },
        },
      },
    },
  })

  // Create payload
  const payload = {
    id: account.user.id,
    role: account.role,
    name: account.user.name,
    avatar: account.user.avatar?.link || null,
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
      accountId: account.id,
    },
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  })

  responseSuccess(res, STATUS.Ok, {
    message: 'Refresh token thành công',
    data: { accessToken: accessToken, refreshToken: refreshToken },
  })
}

const authController = {
  register,
  login,
  logout,
  refreshToken,
}

export default authController
