import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'

const errorMiddleware = (err: AppError | any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    if (typeof err.error === 'string') {
      res.status(err.status).json({ status: 'Error', message: err.error })
    } else {
      res.status(err.status).json({ status: 'Error', message: 'Lỗi', data: err.error })
    }
  } else {
    res.status(STATUS.InternalServerError).json({ status: 'Error', message: err.message })
  }
}

export default errorMiddleware
