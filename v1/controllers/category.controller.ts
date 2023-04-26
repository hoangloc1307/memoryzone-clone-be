import { NextFunction, Request, Response } from 'express'
import prismaClient from '../utils/prisma'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'

// [GET] /categories
const getProductCategories = async (req: Request, res: Response, next: NextFunction) => {
  const categories = await prismaClient.category.findMany({
    orderBy: {
      parentId: 'asc',
    },
  })

  responseSuccess(res, STATUS.Ok, { message: 'Lấy danh mục thành công', data: categories })
}

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

const categoryController = {
  getProductCategories,
  addCategory,
}

export default categoryController
