import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'
import { imgurDelete, imgurUpload } from '../utils/imgur'
import AppError from '../utils/error'

// [GET] /products
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  responseSuccess(res, STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: [] })
}

// [GET] /products/:id
const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  const product = await prismaClient.product.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      name: true,
      price: true,
      priceDiscount: true,
      quantity: true,
      vendor: true,
      shortInfo: true,
      description: true,
      productType: {
        select: {
          id: true,
          type: true,
          productAttributes: {
            select: {
              id: true,
              attribute: true,
            },
          },
        },
      },
      productAttributes: {
        select: {
          productAttributeId: true,
          value: true,
        },
      },
      images: true,
      categories: true,
    },
  })
  // Parse to array
  if (product) {
    product.shortInfo = JSON.parse(product.shortInfo)
  }

  responseSuccess(res, STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: product })
}

// [GET] /products/vendors
const getProductVendors = async (req: Request, res: Response, next: NextFunction) => {
  const vendors = await prismaClient.product.findMany({
    where: {
      vendor: {
        not: '',
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
  const id = Number(req.params.id)
  const files = req.files as Express.Multer.File[]
  const {
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
    productAttributes = [],
  } = req.body
  let images = []

  if (files && files.length > 0) {
    const values = await imgurUpload(files)

    images = values.reduce((result: any, current: any) => {
      const data = current.data
      if (name) {
        return [
          ...result,
          {
            deleteHash: data.deletehash,
            link: data.link,
            name: data.name,
            type: 'PRODUCT_IMAGE',
            alt: name,
          },
        ]
      }
      return [
        ...result,
        {
          deleteHash: data.deletehash,
          link: data.link,
          name: data.name,
          type: 'PRODUCT_IMAGE',
        },
      ]
    }, [])
  }

  const upsertArray = productAttributes.reduce((result: any[], current: any) => {
    if (current.value) {
      return [
        ...result,
        {
          where: {
            value_productId_productAttributeId: {
              productAttributeId: current.productAttributeId,
              productId: id,
              value: current.value,
            },
          },
          create: {
            value: current.value,
            productAttributeId: current.productAttributeId,
          },
          update: {
            value: current.value,
          },
        },
      ]
    }
    return [...result]
  }, [])

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
      productAttributes:
        productAttributes.length > 0
          ? {
              upsert: upsertArray,
            }
          : undefined,
      images:
        images.length > 0
          ? {
              createMany: {
                data: images,
              },
            }
          : undefined,
    },
    include: {
      productType: true,
      productAttributes: true,
      images: true,
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Cập nhật sản phẩm thành công', data: product })
}

// [POST] /products/attributes
const addProductAttributes = async (req: Request, res: Response, next: NextFunction) => {
  const { attributes } = req.body
  const { productTypeId } = req.params

  const attributeArray = attributes.reduce(
    (result: { create: { attribute: string }; where: { attribute: string } }[], current: string) => {
      return [...result, { create: { attribute: current }, where: { attribute: current } }]
    },
    []
  )

  const data = await prismaClient.productType.update({
    where: {
      id: Number(productTypeId),
    },
    data: {
      productAttributes: {
        connectOrCreate: attributeArray,
      },
    },
    include: {
      productAttributes: true,
    },
  })

  responseSuccess(res, STATUS.Created, { message: 'Thêm thuộc tính thành công', data: data })
}

// [GET] /products/attributes
const getProductAttributes = async (req: Request, res: Response, next: NextFunction) => {
  const { productTypeId } = req.params

  const attributes = await prismaClient.productType.findUnique({
    where: {
      id: Number(productTypeId),
    },
    select: {
      productAttributes: {
        select: {
          id: true,
          attribute: true,
        },
      },
    },
  })

  const data = attributes?.productAttributes

  responseSuccess(res, STATUS.Ok, { message: 'Lấy thuộc tính sản phẩm thành công', data: data })
}

// [POST] /products/drafts
const addDraftProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await prismaClient.product.create({
    data: {},
  })
  responseSuccess(res, STATUS.Created, { message: 'Tạo bản nháp sản phẩm thành công', data: product })
}

// [GET] /products/types
const getProductTypes = async (req: Request, res: Response, next: NextFunction) => {
  const types = await prismaClient.productType.findMany()

  // const data = vendors.reduce((result: string[], current) => [...result, current.vendor as string], [])
  responseSuccess(res, STATUS.Ok, { message: 'Lấy loại sản phẩm thành công', data: types })
}

// [DELETE] /products/images
const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
  const { imageId, deleteHash } = req.body
  const imgRes = await imgurDelete(deleteHash)
  if (imgRes.success) {
    const data = await prismaClient.image.delete({ where: { id: imageId } })
    responseSuccess(res, STATUS.Ok, { message: 'Xoá hình ảnh thành công', data: data })
  } else {
    next(new AppError(STATUS.InternalServerError, 'Xoá hình ảnh thất bại', 'IMGUR_DELETE_FAIL'))
  }
}

const productController = {
  getProducts,
  getProductById,
  getProductVendors,
  getProductAttributes,
  getProductTypes,
  addProductAttributes,
  addDraftProduct,
  updateProduct,
  deleteProductImage,
}

export default productController
