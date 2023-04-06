import type { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { hashPassword, verifyPassword } from '../utils/hash'
import prismaClient from '../utils/prisma'
import { response } from '../utils/response'
import { signToken } from '../utils/jwt'
import dotenv from 'dotenv'
dotenv.config()

const register = async (req: Request, res: Response, next: NextFunction) => {
  // Get info from request
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
        response(res, { message: 'Đăng ký thành công' })
      } else {
        next(new AppError(STATUS.InternalServerError, 'Đăng ký không thành công'))
      }
    } else {
      next(new AppError(STATUS.BadRequest, 'Email đã tồn tại'))
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
    })

    if (account) {
      // Check password right
      const isPasswordRight = await verifyPassword(password, account.password)
      if (isPasswordRight) {
        const payload = { id: account.id, email: account.email, role: account.role }
        const accessToken = signToken(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 })

        response(res, {
          message: 'Login thành công',
          data: {
            ...payload,
            access_token: accessToken,
          },
        })
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

const authController = {
  register,
  login,
}

export default authController
