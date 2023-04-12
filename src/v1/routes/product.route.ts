import { Router } from 'express'
import productController from '../controllers/product.controller'
import authMiddleware from '../middlewares/auth.middleware'
import validationMiddleware from '../middlewares/validation.middleware'
import productValidate from '../validations/product'

const productRouter = Router()

productRouter.get('/', productController.getProducts)
productRouter.get('/vendors', productController.getProductVendors)
productRouter.post(
  '/attributes',
  authMiddleware.verifyAdmin,
  productValidate.addProductAttributes,
  validationMiddleware.validatePayload,
  productController.addProductAttributes
)
productRouter.post(
  '/add',
  authMiddleware.verifyAdmin,
  productValidate.addProduct,
  validationMiddleware.validatePayload,
  productController.addProduct
)

export default productRouter
