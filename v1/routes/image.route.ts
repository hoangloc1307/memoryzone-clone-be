import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import { catchError } from '../utils/response'
import imageController from '../controllers/image.controller'

const imageRouter = Router()

imageRouter.get('/', authMiddleware.verifyAdmin, catchError(imageController.getAlbums))
imageRouter.get('/:albumId', authMiddleware.verifyAdmin, catchError(imageController.getImages))

export default imageRouter
