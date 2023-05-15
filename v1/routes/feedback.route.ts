import { Router } from 'express'
import { catchError } from '../utils/response'
import feedbackController from '../controllers/feedback.controller'
import authMiddleware from '../middlewares/auth.middleware'

const feedbackRouter = Router()

feedbackRouter.post(
  '/:productId',
  catchError(authMiddleware.verifyAccessToken),
  catchError(feedbackController.productFeedback)
)

export default feedbackRouter
