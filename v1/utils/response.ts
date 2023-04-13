import { NextFunction, Request, Response } from 'express'

export const responseSuccess = (res: Response, status: number, data: SuccessResponse) => {
  return res.status(status).json({ status: 'Success', ...data })
}

export const catchError = (controllerFunction: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    controllerFunction(req, res, next).catch(next)
  }
}
