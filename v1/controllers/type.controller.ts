import { NextFunction, Request, Response } from 'express'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'

// Get types
const getTypes = async (req: Request, res: Response, next: NextFunction) => {
  const types = await prismaClient.productType.findMany()

  const responseData: { id: number; name: string }[] = types.map(type => ({ id: type.id, name: type.type }))

  responseSuccess(res, STATUS.Ok, { message: 'Lấy loại sản phẩm thành công', data: responseData })
}

// Add type
const addType = async (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.body

  const typeInDB = await prismaClient.productType.findUnique({
    where: {
      type: type,
    },
    select: {
      id: true,
    },
  })

  if (!typeInDB) {
    await prismaClient.productType.create({
      data: {
        type: type,
      },
    })

    responseSuccess(res, STATUS.Ok, { message: 'Thêm loại sản phẩm thành công' })
  } else {
    next(new AppError(STATUS.BadRequest, 'Loại sản phẩm đã tồn tại', 'TYPE_ALREADY_EXISTS'))
  }
}

const typeController = {
  getTypes,
  addType,
}

export default typeController
