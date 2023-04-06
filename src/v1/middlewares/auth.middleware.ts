import { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import AppError from '../utils/error'
import { STATUS } from '../constants/httpStatus'

const dataRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email không được để trống')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email không đúng định dạng'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6, max: 32 })
    .withMessage('Mật khẩu phải từ 6-32 kí tự'),
]

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

const authMiddleware = {
  dataRules,
  validatePayload,
}

export default authMiddleware
