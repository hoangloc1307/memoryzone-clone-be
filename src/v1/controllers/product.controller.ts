import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'
import AppError from '../utils/error'

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  responseSuccess(res, STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: [] })
}

const getProductVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendors = await prismaClient.product.findMany({
      distinct: ['vendor'],
      select: {
        vendor: true,
      },
    })
    const data = vendors.reduce((result: string[], current) => {
      return [...result, current.vendor]
    }, [])
    responseSuccess(res, STATUS.Ok, { message: 'Lấy thương hiệu thành công', data: data })
  } catch (err) {
    next(err)
  }
}

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, price, quantity, vendor, type, price_discount, description, short_info } = req.body
  const product = await prismaClient.product.create({
    data: {
      name,
      price,
      priceDiscount: price_discount ?? 0,
      quantity,
      description: description || `<p>${name}</p>`,
      shortInfo: short_info || JSON.stringify([]),
      vendor,
      productType: {
        connectOrCreate: {
          where: { type: type },
          create: { type: type },
        },
      },
    },
    include: {
      productType: true,
    },
  })
  responseSuccess(res, STATUS.Ok, { message: 'Thêm sản phẩm thành công', data: product })
}

const addProductAttributes = async (req: Request, res: Response, next: NextFunction) => {
  const { product_type_id, attributes } = req.body
  try {
    const productType = await prismaClient.productType.findFirst({
      where: {
        id: product_type_id,
      },
    })
    if (productType) {
      responseSuccess(res, STATUS.Created, { message: 'Thêm thuộc tính thành công' })
    } else {
      next(new AppError(STATUS.NotFound, 'Không tìm thấy loại sản phẩm tương ứng'))
    }
  } catch (err) {
    next(err)
  }
}

const productController = {
  getProducts,
  getProductVendors,
  addProduct,
  addProductAttributes,
}

export default productController
