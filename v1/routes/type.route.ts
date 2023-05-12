import { Router } from 'express'
import { catchError } from '../utils/response'
import typeController from '../controllers/type.controller'
import authMiddleware from '../middlewares/auth.middleware'

const typeRouter = Router()

typeRouter.get('/', catchError(typeController.getTypes))
typeRouter.post('/', authMiddleware.verifyAdmin, catchError(typeController.addType))

export default typeRouter
