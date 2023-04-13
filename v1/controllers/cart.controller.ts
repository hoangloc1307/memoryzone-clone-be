import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'
import AppError from '../utils/error'

// [POST] /cart
const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, userId } = req.body

  const product = await prismaClient.product.findFirst({
    where: {
      id: productId,
    },
  })

  if (product && Number(product.quantity) > 1) {
    const data = await prismaClient.cart.upsert({
      where: {
        productId_userId: {
          productId: productId,
          userId: userId,
        },
      },
      create: {
        quantity: 1,
        productId: productId,
        userId: userId,
      },
      update: {
        quantity: {
          increment: 1,
        },
      },
    })
    responseSuccess(res, STATUS.Created, { message: 'Thêm sản phẩm vào giỏ hàng thành công', data: data })
  } else {
    next(new AppError(STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng'))
  }
}

// [PATCH] /cart
const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, userId, quantity } = req.body

  const product = await prismaClient.product.findFirst({
    where: {
      id: productId,
    },
  })

  if (product && Number(product.quantity) > 1) {
    const availableQuantity = Number(product.quantity) < quantity ? Number(product.quantity) : quantity
    const data = await prismaClient.cart.update({
      where: {
        productId_userId: {
          productId: productId,
          userId: userId,
        },
      },
      data: {
        quantity: availableQuantity,
      },
    })
    responseSuccess(res, STATUS.Created, { message: 'Cập nhật giỏ hàng thành công', data: data })
  } else {
    next(new AppError(STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng'))
  }
}

// [DELETE] /cart
const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, userId } = req.body
  const data = await prismaClient.cart.delete({
    where: {
      productId_userId: {
        productId: productId,
        userId: userId,
      },
    },
  })
  responseSuccess(res, STATUS.Created, { message: 'Xoá sản phẩm khỏi giỏ hàng thành công', data: data })
}

const cartController = {
  addToCart,
  updateCart,
  deleteCartItem,
}

export default cartController
