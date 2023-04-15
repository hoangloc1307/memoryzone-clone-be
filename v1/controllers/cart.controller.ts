import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'
import AppError from '../utils/error'

// [GET] /cart
const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.jwtDecoded.id

  const data = await prismaClient.cart.findMany({
    where: {
      userId: userId,
    },
    select: {
      quantity: true,
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          price: true,
          priceDiscount: true,
          quantity: true,
        },
      },
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Lấy giỏ hàng thành công', data: data })
}

// [POST] /cart
const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.body
  const userId = req.jwtDecoded.id

  const product = await prismaClient.product.findUnique({
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
      select: {
        productId: true,
        quantity: true,
      },
    })
    responseSuccess(res, STATUS.Created, { message: 'Thêm sản phẩm vào giỏ hàng thành công', data: data })
  } else {
    next(new AppError(STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng', 'PRODUCT_NOT_AVAILABLE'))
  }
}

// [PATCH] /cart
const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body
  const userId = req.jwtDecoded.id

  const product = await prismaClient.product.findUnique({
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
      select: {
        productId: true,
        quantity: true,
      },
    })
    responseSuccess(res, STATUS.Created, { message: 'Cập nhật giỏ hàng thành công', data: data })
  } else {
    next(new AppError(STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng', 'PRODUCT_NOT_AVAILABLE'))
  }
}

// [DELETE] /cart
const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.body
  const userId = req.jwtDecoded.id

  const data = await prismaClient.cart.delete({
    where: {
      productId_userId: {
        productId: productId,
        userId: userId,
      },
    },
    select: {
      productId: true,
    },
  })
  responseSuccess(res, STATUS.Created, { message: 'Xoá sản phẩm khỏi giỏ hàng thành công', data: data })
}

const cartController = {
  getCart,
  addToCart,
  updateCart,
  deleteCartItem,
}

export default cartController
