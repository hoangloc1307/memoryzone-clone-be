import { Router } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'
import helperMiddleware from '../middlewares/helper.middleware'

const route = Router()

route.post('/login', authMiddleware.registerRules, helperMiddleware.entityValidator, authController.login)
route.post('/register', authController.register)

const authRouter = route
export default authRouter
