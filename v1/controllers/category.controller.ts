import { NextFunction, Request, Response } from 'express'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'

// [GET] /category
const getProductCategories = async (req: Request, res: Response, next: NextFunction) => {
  const categories = await prismaClient.category.findMany({
    orderBy: {
      parentId: 'asc',
    },
  })

  const data = categories.map(category => (category.parentId === null ? { ...category, parentId: 0 } : category))

  responseSuccess(res, STATUS.Ok, { message: 'Lấy danh mục thành công', data: data })
}

// [POST] /category
const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, parentId } = req.body

  const category = await prismaClient.category.create({
    data: {
      name: name,
      parentId: parentId ? Number(parentId) : undefined,
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Thêm danh mục thành công', data: category })
}

// [PATCH] /category
const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, parentId } = req.body
  const id = Number(req.params.id)

  if (name || (parentId !== null && parentId !== undefined)) {
    const category = await prismaClient.category.update({
      where: {
        id: id,
      },
      data: {
        name: name ?? undefined,
        parentId: parentId ?? undefined,
      },
    })

    responseSuccess(res, STATUS.Ok, { message: 'Cập nhật danh mục thành công', data: category })
  } else {
    next(new AppError(STATUS.BadRequest, 'Không có dữ liệu để cập nhật', 'NO_DATA_TO_UPDATE'))
  }
}
// [DELETE] /category/:id
const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const categoryChildren = await prismaClient.category.findMany({
    where: {
      parentId: id,
    },
  })

  if (categoryChildren.length === 0) {
    const category = await prismaClient.category.delete({
      where: {
        id: id,
      },
    })
    responseSuccess(res, STATUS.Ok, { message: 'Xoá danh mục thành công', data: category })
  } else {
    next(new AppError(STATUS.BadRequest, 'Phải xoá các danh mục con trước', 'SUB_CATEGORIES_EXISTS'))
  }
}

const categoryController = {
  getProductCategories,
  addCategory,
  updateCategory,
  deleteCategory,
}

export default categoryController
