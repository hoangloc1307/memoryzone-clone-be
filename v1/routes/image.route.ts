import { Router } from 'express'
import imageController from '../controllers/image.controller'
import uploadMiddleware from '../middlewares/upload.middleware'
import { catchError } from '../utils/response'

const imageRouter = Router()

imageRouter.post('/upload', uploadMiddleware.productImages, catchError(imageController.uploadImages))

export default imageRouter
