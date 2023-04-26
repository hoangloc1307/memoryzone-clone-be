import { NextFunction, Request, Response } from 'express'
import { FieldValidationError, ValidationError, validationResult } from 'express-validator'
import AppError from '../utils/error'
import { STATUS } from '../constants/httpStatus'

const validatePayload = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    next()
  } else {
    const error = errors.array({ onlyFirstError: true }).reduce((result: any, item: ValidationError) => {
      return { ...result, [(item as FieldValidationError).path]: item.msg }
    }, {})

    next(new AppError(STATUS.BadRequest, error, 'PAYLOAD_ERROR'))
  }
}

const validationMiddleware = {
  validatePayload,
}

export default validationMiddleware
