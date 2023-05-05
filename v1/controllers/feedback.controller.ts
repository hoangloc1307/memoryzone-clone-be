import { NextFunction, Request, Response } from 'express'
import { responseSuccess } from '../utils/response'
import { STATUS } from '../constants/httpStatus'
import prismaClient from '../utils/prisma'

const productFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId
  const userId = req.jwtDecoded.id
  const { comment, rating } = req.body

  await prismaClient.feedback.create({
    data: {
      rating: rating,
      comment: comment,
      productId: Number(productId),
      userId: userId,
    },
  })

  responseSuccess(res, STATUS.Created, { message: 'Phản hồi thành công' })
}

const feedbackController = { productFeedback }

export default feedbackController
