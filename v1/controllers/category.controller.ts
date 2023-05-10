import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'

// [GET] /category
const getProductCategories = async (req: Request, res: Response, next: NextFunction) => {
  const categories = await prismaClient.category.findMany({
    orderBy: [
      {
        parentId: 'asc',
      },
      {
        order: 'asc',
      },
      {
        name: 'asc',
      },
    ],
  })

  const responseData = categories.map(category => {
    return category.parentId === null ? { ...category, parentId: 0 } : category
  })

  responseSuccess(res, STATUS.Ok, { message: 'Lấy danh mục thành công', data: responseData })
}

// [POST] /category
const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, parentId, order } = req.body

  await prismaClient.category.create({
    data: {
      name: name,
      parentId: Number(parentId) || 0,
      order: Number(order) || 0,
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Thêm danh mục thành công' })
}

// [PATCH] /category
const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, parentId, order } = req.body
  const id = Number(req.params.id)

  const category = await prismaClient.category.update({
    where: {
      id: id,
    },
    data: {
      name: name ?? undefined,
      parentId: parentId ?? undefined,
      order: order ?? undefined,
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Cập nhật danh mục thành công', data: category })
}

// [DELETE] /category/:id
const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const deleteCategory = async (id: number) => {
    const categoryChildren = await prismaClient.category.findMany({
      where: {
        parentId: id,
      },
    })

    await Promise.all(categoryChildren.map(child => deleteCategory(child.id)))

    await prismaClient.category.delete({
      where: {
        id: id,
      },
    })
  }

  await deleteCategory(id)

  responseSuccess(res, STATUS.Ok, { message: 'Xoá danh mục thành công' })
}

const categoryController = {
  getProductCategories,
  addCategory,
  updateCategory,
  deleteCategory,
}

export default categoryController
