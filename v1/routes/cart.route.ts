import { Router } from 'express'
import validationMiddleware from '../middlewares/validation.middleware'
import cartValidate from '../validations/cart.validation'
import cartController from '../controllers/cart.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { catchError } from '../utils/response'

const cartRouter = Router()

cartRouter.get('/', catchError(authMiddleware.verifyAccessToken), catchError(cartController.getCart))
cartRouter.post(
  '/',
  catchError(authMiddleware.verifyAccessToken),
  cartValidate.addToCart,
  validationMiddleware.validatePayload,
  catchError(cartController.addToCart)
)
cartRouter.patch(
  '/',
  catchError(authMiddleware.verifyAccessToken),
  cartValidate.updateCart,
  validationMiddleware.validatePayload,
  catchError(cartController.updateCart)
)
cartRouter.delete(
  '/',
  catchError(authMiddleware.verifyAccessToken),
  cartValidate.addToCart,
  validationMiddleware.validatePayload,
  catchError(cartController.deleteCartItem)
)

export default cartRouter
