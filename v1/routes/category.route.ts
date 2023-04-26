import { Router } from 'express'
import categoryController from '../controllers/category.controller'
import { catchError } from '../utils/response'
import categoryValidate from '../validations/category.validation'
import validationMiddleware from '../middlewares/validation.middleware'
import authMiddleware from '../middlewares/auth.middleware'

const categoryRouter = Router()

categoryRouter.get('/', catchError(categoryController.getProductCategories))
categoryRouter.post(
  '/',
  authMiddleware.verifyAdmin,
  categoryValidate.addCategory,
  validationMiddleware.validatePayload,
  catchError(categoryController.addCategory)
)

export default categoryRouter
