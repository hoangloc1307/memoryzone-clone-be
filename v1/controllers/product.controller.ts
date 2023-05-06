import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { imgurDelete, imgurUpload } from '../utils/imgur'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'
import { ProductManageList } from '../types/product.type'

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

  const pagination = {
    limit: Number(limit),
    page: Number(page),
    total: totalRow,
  }

  const productResponse = products.reduce((result: ProductManageList[], current) => {
    return [
      ...result,
      {
        id: current.id,
        name: current.name,
        image: current.images[0]?.link,
        price: current.price,
        priceDiscount: current.priceDiscount,
        type: current.productType?.type,
        quantity: current.quantity,
        rating: current.userFeedbacks.reduce((acc, cur) => acc + cur.rating, 0) / current.userFeedbacks.length,
        categories: current.categories.map(item => item.name),
      },
    ]
  }, [])

  const responseData = {
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
          productAttribute: {
            select: {
              attribute: true,
            },
          },
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

  const responseData = {
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
    attributes: product.productAttributes.reduce((result: { id: number; name: string; value: string }[], current) => {
      return [
        ...result,
        { id: current.productAttributeId, name: current.productAttribute.attribute, value: current.value },
      ]
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
  const data = vendors.reduce((result: string[], current) => [...result, current.vendor as string], [])
  responseSuccess(res, STATUS.Ok, { message: 'Lấy thương hiệu thành công', data: data })
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

// [GET] /products/types
const getProductTypes = async (req: Request, res: Response, next: NextFunction) => {
  const types = await prismaClient.productType.findMany()

  const responseData = types.map(type => ({ id: type.id, name: type.type }))

  responseSuccess(res, STATUS.Ok, { message: 'Lấy loại sản phẩm thành công', data: responseData })
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

// [POST] /products/drafts
const addDraftProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await prismaClient.product.create({
    data: {},
  })
  responseSuccess(res, STATUS.Created, { message: 'Tạo bản nháp sản phẩm thành công', data: product })
}

// [PATCH] /products/update
const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)
  const files = req.files as Express.Multer.File[]
  const {
    name,
    price,
    quantity,
    vendor,
    priceDiscount,
    description,
    shortInfo,
    typeId,
    isDraft,
    isPublish,
    slug,
    attributes,
    categories,
  } = req.body

  let imagesCreateMany = []

  if (files && files.length > 0) {
    const values = await imgurUpload(files)

    imagesCreateMany = values.reduce((result: any, current: any) => {
      const data = current.data

      return name
        ? [
            ...result,
            {
              deleteHash: data.deletehash,
              link: data.link,
              name: data.name,
              type: 'PRODUCT_IMAGE',
              alt: name,
            },
          ]
        : [
            ...result,
            {
              deleteHash: data.deletehash,
              link: data.link,
              name: data.name,
              type: 'PRODUCT_IMAGE',
              alt: 'Product image',
            },
          ]
    }, [])
  }

  const upsertArray = attributes
    ? attributes.reduce((result: any[], current: any) => {
        if (current.value) {
          return [
            ...result,
            {
              where: {
                productId_productAttributeId: {
                  productAttributeId: Number(current.productAttributeId),
                  productId: id,
                },
              },
              create: {
                value: current.value,
                productAttributeId: Number(current.productAttributeId),
              },
              update: {
                value: current.value,
              },
            },
          ]
        }
        return [...result]
      }, [])
    : undefined

  const connectCategories =
    categories?.add && categories.add.length > 0
      ? categories.add.map((item: string) => ({ id: Number(item) }))
      : undefined
  const disconnectCategories =
    categories?.delete && categories.delete.length > 0
      ? categories.delete.map((item: string) => ({ id: Number(item) }))
      : undefined

  const product = await prismaClient.product.update({
    where: {
      id: id,
    },
    data: {
      name: name ?? undefined,
      price: price ? Number(price) : undefined,
      priceDiscount: priceDiscount ? Number(priceDiscount) : undefined,
      quantity: quantity ? Number(quantity) : undefined,
      shortInfo: shortInfo && shortInfo.length >= 0 ? JSON.stringify(shortInfo) : undefined,
      vendor: vendor ?? undefined,
      description: description ?? undefined,
      updatedAt: new Date().toISOString(),
      isDraft: isDraft ?? undefined,
      isPublish: isPublish ?? undefined,
      slug: slug ?? undefined,
      productType: typeId ? { connect: { id: Number(typeId) } } : undefined,
      productAttributes: attributes ? { upsert: upsertArray } : undefined,
      images: imagesCreateMany.length > 0 ? { createMany: { data: imagesCreateMany } } : undefined,
      categories: {
        connect: connectCategories,
        disconnect: disconnectCategories,
      },
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
          productAttributes: { select: { id: true, attribute: true } },
        },
      },
      productAttributes: {
        select: { productAttributeId: true, value: true },
      },
      images: {
        select: { id: true, alt: true, deleteHash: true, name: true, link: true, order: true },
      },
      categories: {
        select: { id: true, name: true, order: true, parentId: true },
      },
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Cập nhật sản phẩm thành công', data: product })
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
