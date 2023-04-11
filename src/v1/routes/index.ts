import type { Express } from 'express'
import authRouter from './auth.route'
import productRouter from './product.route'

export default function routes(app: Express) {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/products', productRouter)
}
