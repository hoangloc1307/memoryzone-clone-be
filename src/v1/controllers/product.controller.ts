import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  responseSuccess(res, STATUS.Ok, { message: 'Lấy sản phẩm thành công', data: [] })
}

const addProduct = (req: Request, res: Response, next: NextFunction) => {
  responseSuccess(res, STATUS.Ok, { message: 'Thêm sản phẩm thành công', data: [] })
}

const productController = {
  getProducts,
  addProduct,
}

export default productController
