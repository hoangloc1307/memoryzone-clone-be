import { Router } from 'express'
import { catchError } from '../utils/response'
import typeController from '../controllers/type.controller'
import authMiddleware from '../middlewares/auth.middleware'

const typeRouter = Router()

typeRouter.get('/', catchError(typeController.getTypes))
typeRouter.post('/', authMiddleware.verifyAdmin, catchError(typeController.addType))
typeRouter.patch('/:id', authMiddleware.verifyAdmin, catchError(typeController.updateType))
typeRouter.delete('/:id', authMiddleware.verifyAdmin, catchError(typeController.deleteType))

export default typeRouter
