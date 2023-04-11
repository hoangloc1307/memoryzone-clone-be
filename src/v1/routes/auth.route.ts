import { Router } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'
import authValidate from '../validations/auth'
import validationMiddleware from '../middlewares/validation.middleware'

const authRouter = Router()

authRouter.post('/register', authValidate.registerRules, validationMiddleware.validatePayload, authController.register)
authRouter.post('/login', authValidate.loginRules, validationMiddleware.validatePayload, authController.login)
authRouter.delete('/logout', authMiddleware.verifyAccessToken, authController.logout)
authRouter.post('/refresh-token', authMiddleware.verifyRefreshToken, authController.refreshToken)
authRouter.post('/get-access-token', authMiddleware.verifyOAuthToken, authController.getAccessToken)

export default authRouter
