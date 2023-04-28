import { Router } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'
import authValidate from '../validations/auth.validation'
import validationMiddleware from '../middlewares/validation.middleware'
import { catchError } from '../utils/response'

const authRouter = Router()

authRouter.post(
  '/register',
  authValidate.register,
  validationMiddleware.validatePayload,
  catchError(authController.register)
)
authRouter.post('/login', authValidate.login, validationMiddleware.validatePayload, catchError(authController.login))
authRouter.patch('/refresh-token', authMiddleware.verifyRefreshToken, catchError(authController.refreshToken))
authRouter.delete('/logout', authMiddleware.verifyAccessToken, catchError(authController.logout))
// authRouter.post('/get-access-token', authMiddleware.verifyOAuthToken, catchError(authController.getAccessToken))

export default authRouter
