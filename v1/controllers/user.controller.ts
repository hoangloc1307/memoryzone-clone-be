import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'

// Get user info
const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: req.jwtDecoded.id,
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Lấy thông tin thành công', data: user })
}

const userController = { getMe }

export default userController
