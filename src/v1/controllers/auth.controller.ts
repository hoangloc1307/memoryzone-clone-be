import type { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import prismaClient from '../utils/prisma'
import { response } from '../utils/response'

const login = async (req: Request, res: Response, next: NextFunction) => {
  // const { email, password } = req.body
  // // try {
  // //   const x = []
  // //   //@ts-ignore
  // //   x = 3
  // // } catch (err) {
  // //   next(err)
  // // }
  response(res, { message: 'Login' })
}

const register = async (req: Request, res: Response, next: NextFunction) => {
  // Get info from request
  const { email, password } = req.body

  const errors = []
  if (email)
    try {
      // Check email exists
      const existsEmail = await prismaClient.account.findFirst({
        where: {
          email: email,
        },
      })
      if (!existsEmail) {
        const account = await prismaClient.account.create({
          data: {
            email: email,
            password: password,
          },
        })
        if (account) {
          response(res, { message: 'Đăng ký thành công' })
        } else {
          response(res, { message: 'Đăng ký không thành công' })
        }
      } else {
        next(new AppError(STATUS.BadRequest, 'Email đã tồn tại!'))
      }
    } catch (err) {
      next(err)
    }
}

const authController = {
  login,
  register,
}

export default authController
