import type { Express } from 'express'
import authRouter from './auth.route'
import productRouter from './product.route'
import cartRouter from './cart.route'
import userRouter from './user.route'
import categoryRouter from './category.route'
import imageRouter from './image.route'

export default function routes(app: Express) {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/products', productRouter)
  app.use('/api/v1/cart', cartRouter)
  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/category', categoryRouter)
  app.use('/api/v1/image', imageRouter)
}
