import { NextFunction, Request, Response } from 'express'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'

interface ConnectOrCreateAttribute {
  create: {
    attribute: string
  }
  where: {
    attribute: string
  }
}

interface DisconnectAttribute {
  attribute: string
}

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

// Update type
const updateType = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)
  const { type, attributes }: { type: string; attributes: string[] } = req.body
  let connectOrCreateAttributes: ConnectOrCreateAttribute[] = []
  let disconnectAttributes: DisconnectAttribute[] = []

  if (attributes) {
    const res = await prismaClient.productType.findUnique({
      where: {
        id: id,
      },
      select: {
        productAttributes: {
          select: {
            attribute: true,
          },
        },
      },
    })
    const attributesInDB = res?.productAttributes.map(item => item.attribute) || []

    connectOrCreateAttributes = attributes.reduce((result: ConnectOrCreateAttribute[], current) => {
      if (!attributesInDB.includes(current)) {
        return [
          ...result,
          {
            create: {
              attribute: current,
            },
            where: {
              attribute: current,
            },
          },
        ]
      }
      return [...result]
    }, [])

    disconnectAttributes = attributesInDB.reduce((result: DisconnectAttribute[], current) => {
      if (!attributes.includes(current)) {
        return [
          ...result,
          {
            attribute: current,
          },
        ]
      }
      return [...result]
    }, [])
  }

  await prismaClient.productType.update({
    where: {
      id: id,
    },
    data: {
      type: type,
      productAttributes: {
        connectOrCreate: connectOrCreateAttributes.length > 0 ? connectOrCreateAttributes : undefined,
        disconnect: disconnectAttributes.length > 0 ? disconnectAttributes : undefined,
      },
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Cập nhật loại sản phẩm thành công' })
}

// Delete type
const deleteType = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  await prismaClient.productType.delete({
    where: {
      id: id,
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Xoá loại sản phẩm thành công' })
}

const typeController = {
  getTypes,
  addType,
  updateType,
  deleteType,
}

export default typeController
