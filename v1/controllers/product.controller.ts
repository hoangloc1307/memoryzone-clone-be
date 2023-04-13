import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'
import AppError from '../utils/error'

// [GET] /products
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  responseSuccess(res, STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: [] })
}

// [GET] /products/vendors
const getProductVendors = async (req: Request, res: Response, next: NextFunction) => {
  const vendors = await prismaClient.product.findMany({
    where: {
      vendor: {
        not: null,
      },
    },
    distinct: ['vendor'],
    select: {
      vendor: true,
    },
  })
  const data = vendors.reduce((result: string[], current) => [...result, current.vendor as string], [])
  responseSuccess(res, STATUS.Ok, { message: 'Lấy thương hiệu thành công', data: data })
}

// [PATCH] /products/update
const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const {
    id,
    name,
    price,
    view,
    quantity,
    vendor,
    priceDiscount,
    description,
    shortInfo,
    productTypeId,
    isDraft,
    isPublish,
    slug,
  } = req.body

  const product = await prismaClient.product.update({
    where: {
      id: id,
    },
    data: {
      name: name ?? undefined,
      price: price ?? undefined,
      priceDiscount: priceDiscount ?? undefined,
      view: view ?? undefined,
      quantity: quantity ?? undefined,
      shortInfo: shortInfo && shortInfo.length >= 0 ? JSON.stringify(shortInfo) : undefined,
      vendor: vendor ?? undefined,
      description: description ?? undefined,
      updatedAt: new Date().toISOString(),
      isDraft: isDraft ?? undefined,
      isPublish: isPublish ?? undefined,
      slug: slug ?? undefined,
      productType: productTypeId
        ? {
            connect: {
              id: productTypeId,
            },
          }
        : undefined,
    },
    include: {
      productType: true,
    },
  })
  responseSuccess(res, STATUS.Ok, { message: 'Cập nhật sản phẩm thành công', data: product })
}

// [POST] /products/attributes
const addProductAttributes = async (req: Request, res: Response, next: NextFunction) => {
  const { productTypeId, attributes } = req.body

  const productType = await prismaClient.productType.findFirst({
    where: {
      id: productTypeId,
    },
  })

  if (productType) {
    const attributeArray = attributes.reduce((result: [{ attribute: string }], current: string) => {
      return [...result, { attribute: current, productTypeId: productType.id }]
    }, [])

    const data = await prismaClient.productAttribute.createMany({
      data: attributeArray,
      skipDuplicates: true,
    })

    responseSuccess(res, STATUS.Created, { message: 'Thêm thuộc tính thành công', data: data })
  } else {
    next(new AppError(STATUS.NotFound, 'Không tìm thấy loại sản phẩm tương ứng'))
  }
}

// [GET] /products/attributes
const getProductAttributes = async (req: Request, res: Response, next: NextFunction) => {
  const { productTypeId } = req.body

  const attributes = await prismaClient.productAttribute.findMany({
    where: {
      productTypeId: productTypeId,
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Lấy thuộc tính sản phẩm thành công', data: attributes })
}

// [POST] /products/drafts
const addDraftProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await prismaClient.product.create({
    data: {},
  })
  responseSuccess(res, STATUS.Created, { message: 'Tạo bản nháp sản phẩm thành công', data: product })
}

const productController = {
  getProducts,
  getProductVendors,
  getProductAttributes,
  updateProduct,
  addProductAttributes,
  addDraftProduct,
}

export default productController
