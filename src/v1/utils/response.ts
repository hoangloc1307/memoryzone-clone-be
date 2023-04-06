import { Response } from 'express'
import { STATUS } from '../constants/httpStatus'

export const response = (res: Response, data: SuccessResponse) => {
  return res.status(STATUS.Ok).send({ status: 'Success', ...data })
}
