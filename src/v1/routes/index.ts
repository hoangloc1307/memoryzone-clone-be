import type { Express } from 'express'
import authRouter from './auth.route'

export default function routes(app: Express) {
  app.use('/api/v1/auth', authRouter)
}
