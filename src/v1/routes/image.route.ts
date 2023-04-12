import { Router } from 'express'
import imageController from '../controllers/image.controller'
import uploadMiddleware from '../middlewares/upload.middleware'

const imageRouter = Router()

imageRouter.post('/upload', uploadMiddleware.productImages, imageController.uploadImages)

export default imageRouter
