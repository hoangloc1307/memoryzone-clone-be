import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import userController from '../controllers/user.controller'
import { catchError } from '../utils/response'

const userRouter = Router()

userRouter.get('/', catchError(authMiddleware.verifyAccessToken), catchError(userController.getMe))

export default userRouter
