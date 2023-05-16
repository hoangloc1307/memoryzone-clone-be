import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'
import AppError from '../utils/error'
import { CartItem } from '../types/cart.type'

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
          images: {
            select: {
              link: true,
              alt: true,
            },
            orderBy: {
              id: 'asc',
            },
            take: 1,
          },
          price: true,
          priceDiscount: true,
          quantity: true,
        },
      },
    },
  })

  const responseData: CartItem[] = data.map(item => ({
    id: item.product.id,
    name: item.product.name,
    image: item.product.images[0],
    price: item.product.price,
    priceDiscount: item.product.priceDiscount,
    inStock: item.product.quantity,
    quantity: item.quantity,
  }))

  responseSuccess(res, STATUS.Ok, { message: 'Lấy giỏ hàng thành công', data: responseData })
}

// Add product to cart
const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const productId: number = req.body.productId
  const userId = req.jwtDecoded.id

  const product = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      quantity: true,
    },
  })

  if (product && product.quantity > 1) {
    await prismaClient.cart.create({
      data: {
        quantity: 1,
        productId: productId,
        userId: userId,
      },
    })
    responseSuccess(res, STATUS.Created, { message: 'Thêm sản phẩm vào giỏ hàng thành công' })
  } else {
    next(new AppError(STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng', 'PRODUCT_NOT_AVAILABLE'))
  }
}

// Update cart item
const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity }: { productId: number; quantity: number } = req.body
  const userId = req.jwtDecoded.id

  const product = await prismaClient.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      quantity: true,
    },
  })

  if (product && product.quantity > 1) {
    const availableQuantity = product.quantity < quantity ? product.quantity : quantity
    await prismaClient.cart.update({
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
    responseSuccess(res, STATUS.Ok, { message: 'Cập nhật giỏ hàng thành công' })
  } else {
    next(new AppError(STATUS.NotFound, 'Sản phẩm không tồn tại hoặc đã hết hàng', 'PRODUCT_NOT_AVAILABLE'))
  }
}

// Delete cart item
const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.body
  const userId = req.jwtDecoded.id

  await prismaClient.cart.delete({
    where: {
      productId_userId: {
        productId: productId,
        userId: userId,
      },
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Xoá sản phẩm khỏi giỏ hàng thành công' })
}

const cartController = {
  getCart,
  addToCart,
  updateCart,
  deleteCartItem,
}

export default cartController
