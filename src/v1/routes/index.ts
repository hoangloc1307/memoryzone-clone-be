import type { Express } from 'express'
import authRouter from './auth.route'
import productRouter from './product.route'
import imageRouter from './image.route'

export default function routes(app: Express) {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/products', productRouter)
  app.use('/api/v1/images', imageRouter)
}
