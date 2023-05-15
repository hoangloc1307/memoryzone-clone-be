import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import { catchError } from '../utils/response'
import imageController from '../controllers/image.controller'

const imageRouter = Router()

imageRouter.get('/', catchError(authMiddleware.verifyAdmin), catchError(imageController.getAlbums))
imageRouter.get('/:albumId', catchError(authMiddleware.verifyAdmin), catchError(imageController.getImages))
imageRouter.patch('/:id', catchError(authMiddleware.verifyAdmin), catchError(imageController.updateImage))

export default imageRouter
