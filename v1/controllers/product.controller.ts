import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import { GetProductByIdResponse, GetProductsResponse, Pagination, Product } from '../types/product.type'
import { imgurDelete, imgurUpload } from '../utils/imgur'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { limit, page, name } = req.query

  const where = {
    name: {
      contains: name ? String(name) : undefined,
    },
    status: true,
  }

  const [totalRow, products] = await prismaClient.$transaction([
    prismaClient.product.count({
      where: where,
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
        status: true,
        updatedAt: true,
      },
      where: where,
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
    status: product.status,
    updatedAt: product.updatedAt,
  }))

  const responseData: GetProductsResponse = {
    pagination,
    products: productResponse,
  }

  responseSuccess(res, STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: responseData })
}

const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  const product = await prismaClient.product.findUniqueOrThrow({
    where: {
      id: Number(id) || 0,
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

const getVendors = async (req: Request, res: Response, next: NextFunction) => {
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

const getAttributes = async (req: Request, res: Response, next: NextFunction) => {
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

const addDraftProduct = async (req: Request, res: Response, next: NextFunction) => {
  const draft = await prismaClient.product.create({
    data: {},
    select: {
      id: true,
    },
  })

  responseSuccess(res, STATUS.Created, { message: 'Tạo bản nháp sản phẩm thành công', data: draft })
}

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const id: number = Number(req.params.id)
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
    altImages,
    status,
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
    altImages?: string[]
    status?: boolean
  } = req.body
  let imagesCreateMany: {
    deleteHash: string
    link: string
    name: string
    type: string
    alt?: string
  }[] = []

  // Prepare categories
  const connectCategories =
    categories?.add && categories.add.length > 0 ? categories.add.map((id: number) => ({ id })) : undefined
  const disconnectCategories =
    categories?.delete && categories.delete.length > 0 ? categories.delete.map((id: number) => ({ id })) : undefined

  // Prepare attributes
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

  // Prepare images
  if (files && files.length > 0) {
    const values = await imgurUpload(files)

    imagesCreateMany = values.map((current: any, index) => ({
      deleteHash: current.data.deletehash,
      link: current.data.link,
      name: current.data.name,
      type: 'PRODUCT_IMAGE',
      alt: altImages?.[index] || 'Product image',
    }))
  }

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
      images: imagesCreateMany.length > 0 ? { createMany: { data: imagesCreateMany } } : undefined,
      status: status ?? undefined,
      updatedAt: new Date().toISOString(),
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Cập nhật sản phẩm thành công' })
}

const deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
  const { ids, deleteHashs } = req.body

  await Promise.all([
    imgurDelete(deleteHashs),
    prismaClient.image.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    }),
  ])

  responseSuccess(res, STATUS.Ok, { message: 'Xoá hình ảnh thành công' })
}

const productController = {
  getProducts,
  getProductById,
  getVendors,
  getAttributes,
  addProductAttributes,
  addDraftProduct,
  updateProduct,
  deleteProductImage,
}

export default productController
