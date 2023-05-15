import { Router } from 'express'
import categoryController from '../controllers/category.controller'
import { catchError } from '../utils/response'
import categoryValidate from '../validations/category.validation'
import validationMiddleware from '../middlewares/validation.middleware'
import authMiddleware from '../middlewares/auth.middleware'

const categoryRouter = Router()

// Get all categories
categoryRouter.get('/', catchError(categoryController.getProductCategories))

// Add category
categoryRouter.post(
  '/',
  catchError(authMiddleware.verifyAdmin),
  categoryValidate.addCategory,
  validationMiddleware.validatePayload,
  catchError(categoryController.addCategory)
)

// Update category
categoryRouter.patch(
  '/:id',
  catchError(authMiddleware.verifyAdmin),
  categoryValidate.updateCategory,
  validationMiddleware.validatePayload,
  catchError(categoryController.updateCategory)
)

// Delete category
categoryRouter.delete(
  '/:id',
  catchError(authMiddleware.verifyAdmin),
  categoryValidate.deleteCategory,
  validationMiddleware.validatePayload,
  catchError(categoryController.deleteCategory)
)

export default categoryRouter
