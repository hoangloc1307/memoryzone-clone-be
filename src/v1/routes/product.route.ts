import { Router } from 'express'
import productController from '../controllers/product.controller'
import authMiddleware from '../middlewares/auth.middleware'
import validationMiddleware from '../middlewares/validation.middleware'
import productValidate from '../validations/product'

const productRouter = Router()

productRouter.post(
  '/add',
  authMiddleware.verifyAdmin,
  productValidate.addProductRules,
  validationMiddleware.validatePayload,
  productController.addProduct
)
productRouter.get('/', productController.getProducts)

export default productRouter
