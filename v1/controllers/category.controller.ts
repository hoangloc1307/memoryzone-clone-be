import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'

// Get all categories
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

  responseSuccess(res, STATUS.Ok, { message: 'Lấy danh mục thành công', data: categories })
}

// Add category
const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, parentId, order } = req.body

  await prismaClient.category.create({
    data: {
      name: name,
      parentId: Number(parentId) || 0,
      order: Number(order) || 0,
    },
  })

  responseSuccess(res, STATUS.Created, { message: 'Thêm danh mục thành công' })
}

// Update category
const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)
  const { name, parentId, order } = req.body

  await prismaClient.category.update({
    where: {
      id: id,
    },
    data: {
      name: name ?? undefined,
      parentId: parentId ?? undefined,
      order: order ?? undefined,
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Cập nhật danh mục thành công' })
}

// Delete category
const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const deleteCategoryRecursive = async (categoryId: number) => {
    const categoryChildren = await prismaClient.category.findMany({
      where: {
        parentId: categoryId,
      },
    })

    await Promise.all(categoryChildren.map(child => deleteCategoryRecursive(child.id)))

    await prismaClient.category.delete({
      where: {
        id: categoryId,
      },
    })
  }

  await deleteCategoryRecursive(id)

  responseSuccess(res, STATUS.Ok, { message: 'Xoá danh mục thành công' })
}

const categoryController = {
  getProductCategories,
  addCategory,
  updateCategory,
  deleteCategory,
}

export default categoryController
