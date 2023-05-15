import { Router } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'
import authValidate from '../validations/auth.validation'
import validationMiddleware from '../middlewares/validation.middleware'
import { catchError } from '../utils/response'

const authRouter = Router()

// Register
authRouter.post(
  '/register',
  authValidate.register,
  validationMiddleware.validatePayload,
  catchError(authController.register)
)

// Login
authRouter.post('/login', authValidate.login, validationMiddleware.validatePayload, catchError(authController.login))

// Refresh token
authRouter.patch(
  '/refresh-token',
  catchError(authMiddleware.verifyRefreshToken),
  catchError(authController.refreshToken)
)

// Logout
authRouter.delete('/logout', catchError(authMiddleware.verifyAccessToken), catchError(authController.logout))

export default authRouter
