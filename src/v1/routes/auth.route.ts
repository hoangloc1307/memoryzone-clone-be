import { Router } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'

const route = Router()

route.post('/login', authMiddleware.dataRules, authMiddleware.validatePayload, authController.login)
route.post('/register', authMiddleware.dataRules, authMiddleware.validatePayload, authController.register)

const authRouter = route
export default authRouter
