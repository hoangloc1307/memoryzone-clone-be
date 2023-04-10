import { Router } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'

const route = Router()

route.post('/register', authMiddleware.dataRules, authMiddleware.validatePayload, authController.register)
route.post('/login', authMiddleware.dataRules, authMiddleware.validatePayload, authController.login)
route.delete('/logout', authMiddleware.verifyAccessToken, authController.logout)
route.post('/refresh-token', authMiddleware.verifyRefreshToken, authController.refreshToken)
route.post('/get-access-token', authMiddleware.verifyOAuthToken, authController.getAccessToken)

const authRouter = route
export default authRouter
