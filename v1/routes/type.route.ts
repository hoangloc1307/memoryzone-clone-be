import { Router } from 'express'
import { catchError } from '../utils/response'
import typeController from '../controllers/type.controller'
import authMiddleware from '../middlewares/auth.middleware'
import typeValidate from '../validations/type.validation'
import validationMiddleware from '../middlewares/validation.middleware'

const typeRouter = Router()

// Get all types
typeRouter.get('/', catchError(typeController.getTypes))

// Add new type
typeRouter.post(
  '/',
  catchError(authMiddleware.verifyAdmin),
  typeValidate.addType,
  validationMiddleware.validatePayload,
  catchError(typeController.addType)
)

// Update type
typeRouter.patch(
  '/:id',
  catchError(authMiddleware.verifyAdmin),
  typeValidate.updateType,
  validationMiddleware.validatePayload,
  catchError(typeController.updateType)
)

// Delete type
typeRouter.delete(
  '/:id',
  catchError(authMiddleware.verifyAdmin),
  typeValidate.deleteType,
  validationMiddleware.validatePayload,
  catchError(typeController.deleteType)
)

export default typeRouter
