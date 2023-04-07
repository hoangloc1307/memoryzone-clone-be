import { Response } from 'express'
import { STATUS } from '../constants/httpStatus'

export const responseSuccess = (res: Response, status: number, data: SuccessResponse) => {
  return res.status(status).json({ status: 'Success', ...data })
}
