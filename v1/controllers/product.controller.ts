import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { imgurDelete, imgurUpload } from '../utils/imgur'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'
import { GetProductByIdResponse, GetProductsResponse, Pagination, Product } from '../types/product.type'

// [GET] /products
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { limit, page, name } = req.query

  const [totalRow, products] = await prismaClient.$transaction([
    prismaClient.product.count({
      where: {
        name: {
          contains: name ? String(name) : undefined,
        },
      },
    }),
    prismaClient.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        priceDiscount: true,
        quantity: true,
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
        userFeedbacks: {
          select: {
            rating: true,
          },
        },
        productType: {
          select: {
            type: true,
          },
        },
        categories: {
          select: {
            name: true,
          },
        },
      },
      where: {
        name: {
          contains: name ? String(name) : undefined,
        },
      },
      orderBy: {
        id: 'desc',
      },
      take: Number(limit) || undefined,
      skip: Number(limit) && Number(page) ? (Number(page) - 1) * Number(limit) : undefined,
    }),
  ])

  const pagination: Pagination = {
    limit: Number(limit),
    page: Number(page),
    total: totalRow,
  }

  const productResponse: Product[] = products.map(product => ({
    id: product.id,
    name: product.name,
    image: product.images[0]?.link,
    price: product.price,
    priceDiscount: product.priceDiscount,
    type: product.productType?.type,
    quantity: product.quantity,
    rating: product.userFeedbacks.reduce((acc, cur) => acc + cur.rating, 0) / product.userFeedbacks.length,
    categories: product.categories.map(item => item.name),
  }))

  const responseData: GetProductsResponse = {
    pagination,
    products: productResponse,
  }

  responseSuccess(res, STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: responseData })
}

// [GET] /products/:id
const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  const product = await prismaClient.product.findUniqueOrThrow({
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
      slug: true,
      isDraft: true,
      isPublish: true,
      productType: {
        select: {
          id: true,
          type: true,
        },
      },
      productAttributes: {
        select: {
          productAttributeId: true,
          value: true,
        },
      },
      images: {
        select: {
          id: true,
          alt: true,
          deleteHash: true,
          name: true,
          link: true,
          order: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  const responseData: GetProductByIdResponse = {
    id: product.id,
    name: product.name,
    price: product.price,
    priceDiscount: product.priceDiscount,
    quantity: product.quantity,
    vendor: product.vendor,
    shortInfo: JSON.parse(product.shortInfo),
    description: product.description,
    slug: product.slug,
    isDraft: product.isDraft,
    isPublish: product.isPublish,
    type: { id: product.productType?.id, name: product.productType?.type },
    attributes: product.productAttributes.reduce((result: { id: number; value: string }[], current) => {
      return [...result, { id: current.productAttributeId, value: current.value }]
    }, []),
    images: product.images,
    categories: product.categories,
  }

  responseSuccess(res, STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: responseData })
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

  const responseData: string[] = vendors.map(item => item.vendor)

  responseSuccess(res, STATUS.Ok, { message: 'Lấy thương hiệu thành công', data: responseData })
}

// [GET] /products/attributes
const getProductAttributes = async (req: Request, res: Response, next: NextFunction) => {
  const { productTypeId } = req.params

  const attributes = await prismaClient.productType.findUniqueOrThrow({
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

  const responseData: { id: number; name: string }[] =
    attributes.productAttributes.map(attr => ({
      id: attr.id,
      name: attr.attribute,
    })) || []

  responseSuccess(res, STATUS.Ok, { message: 'Lấy thuộc tính sản phẩm thành công', data: responseData })
}

// [GET] /products/types
const getProductTypes = async (req: Request, res: Response, next: NextFunction) => {
  const types = await prismaClient.productType.findMany()

  const responseData: { id: number; name: string }[] = types.map(type => ({ id: type.id, name: type.type }))

  responseSuccess(res, STATUS.Ok, { message: 'Lấy loại sản phẩm thành công', data: responseData })
}

// [POST] /products/attributes/:productTypeId
const addProductAttributes = async (req: Request, res: Response, next: NextFunction) => {
  const { attributes } = req.body
  const { productTypeId } = req.params

  const attributeArray = attributes.map((item: string) => ({
    create: { attribute: item },
    where: { attribute: item },
  }))

  await prismaClient.productType.update({
    where: {
      id: Number(productTypeId),
    },
    data: {
      productAttributes: {
        connectOrCreate: attributeArray,
      },
    },
  })

  responseSuccess(res, STATUS.Created, { message: 'Thêm thuộc tính thành công' })
}

// [POST] /products/drafts
const addDraftProduct = async (req: Request, res: Response, next: NextFunction) => {
  await prismaClient.product.create({
    data: {},
  })

  responseSuccess(res, STATUS.Created, { message: 'Tạo bản nháp sản phẩm thành công' })
}

// [PATCH] /products/:id
const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)
  const files = req.files as Express.Multer.File[]
  const {
    name,
    price,
    priceDiscount,
    quantity,
    vendor,
    shortInfo,
    slug,
    categories,
    description,
    typeId,
    attributes,
  }: {
    name?: string
    price?: number
    priceDiscount?: number
    quantity?: number
    vendor?: string
    shortInfo?: string[]
    slug?: string
    categories?: { add: number[]; delete: number[] }
    description?: string
    typeId?: number
    attributes?: { id: number; value: string }[]
  } = req.body

  // let imagesCreateMany = []

  // if (files && files.length > 0) {
  //   const values = await imgurUpload(files)

  //   imagesCreateMany = values.reduce((result: any, current: any) => {
  //     const data = current.data

  //     return name
  //       ? [
  //           ...result,
  //           {
  //             deleteHash: data.deletehash,
  //             link: data.link,
  //             name: data.name,
  //             type: 'PRODUCT_IMAGE',
  //             alt: name,
  //           },
  //         ]
  //       : [
  //           ...result,
  //           {
  //             deleteHash: data.deletehash,
  //             link: data.link,
  //             name: data.name,
  //             type: 'PRODUCT_IMAGE',
  //             alt: 'Product image',
  //           },
  //         ]
  //   }, [])
  // }

  const connectCategories =
    categories?.add && categories.add.length > 0 ? categories.add.map((id: number) => ({ id })) : undefined
  const disconnectCategories =
    categories?.delete && categories.delete.length > 0 ? categories.delete.map((id: number) => ({ id })) : undefined

  const upsertArray = attributes?.map(current => ({
    where: {
      productId_productAttributeId: {
        productAttributeId: current.id,
        productId: id,
      },
    },
    create: {
      value: current.value,
      productAttributeId: current.id,
    },
    update: {
      value: current.value,
    },
  }))

  await prismaClient.product.update({
    where: {
      id: id,
    },
    data: {
      name: name ?? undefined,
      price: price ?? undefined,
      priceDiscount: priceDiscount ?? undefined,
      quantity: quantity ?? undefined,
      vendor: vendor ?? undefined,
      shortInfo: shortInfo && shortInfo.length >= 0 ? JSON.stringify(shortInfo) : undefined,
      slug: slug ?? undefined,
      categories: {
        connect: connectCategories,
        disconnect: disconnectCategories,
      },
      description: description ?? undefined,
      productType: typeId ? { connect: { id: typeId } } : undefined,
      productAttributes: attributes ? { upsert: upsertArray } : undefined,
      // isDraft: isDraft ?? undefined,
      // isPublish: isPublish ?? undefined,
      // images: imagesCreateMany.length > 0 ? { createMany: { data: imagesCreateMany } } : undefined,
      updatedAt: new Date().toISOString(),
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Cập nhật sản phẩm thành công' })
}

// [PATCH] /products/images
const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
  const { imageId, deleteHash } = req.body
  const imgRes = await imgurDelete(deleteHash)

  if (imgRes.success) {
    const image = await prismaClient.image.delete({
      where: { id: imageId },
      select: {
        id: true,
        alt: true,
        deleteHash: true,
        name: true,
        link: true,
        order: true,
      },
    })
    responseSuccess(res, STATUS.Ok, { message: 'Xoá hình ảnh thành công', data: image })
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
