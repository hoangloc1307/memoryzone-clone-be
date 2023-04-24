import { Router } from 'express'
import productController from '../controllers/product.controller'
import authMiddleware from '../middlewares/auth.middleware'
import validationMiddleware from '../middlewares/validation.middleware'
import productValidate from '../validations/product.validation'
import { catchError } from '../utils/response'
import uploadMiddleware from '../middlewares/upload.middleware'

const productRouter = Router()

// GET
productRouter.get('/', catchError(productController.getProducts))
productRouter.get('/vendors', catchError(productController.getProductVendors))
productRouter.get('/attributes/:productTypeId', catchError(productController.getProductAttributes))
productRouter.get('/types', catchError(productController.getProductTypes))
productRouter.get('/:id', catchError(productController.getProductById))

// POST
productRouter.post(
  '/attributes/:productTypeId',
  authMiddleware.verifyAdmin,
  productValidate.addProductAttributes,
  validationMiddleware.validatePayload,
  catchError(productController.addProductAttributes)
)
productRouter.post('/drafts', authMiddleware.verifyAdmin, catchError(productController.addDraftProduct))

// PATCH
productRouter.patch(
  '/images',
  authMiddleware.verifyAdmin,
  productValidate.deleteProductImage,
  validationMiddleware.validatePayload,
  catchError(productController.deleteProductImage)
)
productRouter.patch(
  '/:id',
  authMiddleware.verifyAdmin,
  productValidate.updateProduct,
  uploadMiddleware.productImages,
  validationMiddleware.validatePayload,
  catchError(productController.updateProduct)
)

export default productRouter
