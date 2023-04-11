import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import AppError from '../utils/error'
import { STATUS } from '../constants/httpStatus'

const validatePayload = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    next()
  } else {
    const error = errors.array({ onlyFirstError: true }).reduce((result: any, item, index) => {
      result[item.param] = item.msg
      return result
    }, {})

    next(new AppError(STATUS.BadRequest, error))
  }
}

const validationMiddleware = {
  validatePayload,
}

export default validationMiddleware
