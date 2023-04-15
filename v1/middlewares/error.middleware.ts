import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'

const errorMiddleware = (err: AppError | any, req: Request, res: Response, next: NextFunction) => {
  switch (err.constructor.name) {
    case 'AppError':
      if (typeof err.error === 'string') {
        res.status(err.status).json({ status: 'Error', name: err.name, message: err.error })
      } else {
        res.status(err.status).json({ status: 'Error', name: err.name, message: 'Lỗi', data: err.error })
      }
      break

    case 'MulterError':
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        res
          .status(STATUS.BadRequest)
          .json({ status: 'Error', message: 'Lỗi', data: { [err.field]: 'Quá số lượng file quy định' } })
      }
      break

    case 'PrismaClientRustPanicError':
    case 'PrismaClientValidationError':
    case 'PrismaClientKnownRequestError':
    case 'PrismaClientInitializationError':
    case 'PrismaClientUnknownRequestError':
      res
        .status(STATUS.InternalServerError)
        .json({ status: 'Error', message: err.constructor.name.replace('Prisma', '') })
      break

    default:
      res
        .status(STATUS.InternalServerError)
        .json({ status: 'Error', message: err.message || 'Có lỗi trong quá trình xử lý' })
  }
}

export default errorMiddleware
