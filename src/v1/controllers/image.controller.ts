import axios, { AxiosPromise } from 'axios'
import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../constants/httpStatus'
import AppError from '../utils/error'
import { responseSuccess } from '../utils/response'
import { imgurUpload } from '../utils/imgur'

const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const productImages = files['product-images']

  if (productImages && productImages.length > 0) {
    try {
      const values = await imgurUpload(productImages)
      const data = values.reduce((result: any, current) => {
        return [...result, current.data.data]
      }, [])
      responseSuccess(res, STATUS.Created, { message: 'Upload hình ảnh thành công', data: data })
    } catch (err) {
      next(err)
    }
  } else {
    next(new AppError(STATUS.BadRequest, 'Không có hình nào được đính kèm'))
  }
}

const imageController = { uploadImages }

export default imageController
