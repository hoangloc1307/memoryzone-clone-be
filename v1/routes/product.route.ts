import { Router } from 'express'
import productController from '../controllers/product.controller'
import authMiddleware from '../middlewares/auth.middleware'
import validationMiddleware from '../middlewares/validation.middleware'
import productValidate from '../validations/product.validation'
import { catchError } from '../utils/response'

const productRouter = Router()

productRouter.get('/', catchError(productController.getProducts))
productRouter.get('/vendors', catchError(productController.getProductVendors))
productRouter.get('/attributes', catchError(productController.getProductAttributes))
productRouter.get('/types', catchError(productController.getProductTypes))
productRouter.get('/:id', catchError(productController.getProductById))
productRouter.post(
  '/attributes',
  authMiddleware.verifyAdmin,
  productValidate.addProductAttributes,
  validationMiddleware.validatePayload,
  catchError(productController.addProductAttributes)
)
productRouter.post('/drafts', authMiddleware.verifyAdmin, catchError(productController.addDraftProduct))
productRouter.patch(
  '/:id',
  authMiddleware.verifyAdmin,
  productValidate.updateProduct,
  validationMiddleware.validatePayload,
  catchError(productController.updateProduct)
)

export default productRouter
