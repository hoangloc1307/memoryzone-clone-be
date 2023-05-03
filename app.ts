import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import errorMiddleware from './v1/middlewares/error.middleware'
import routes from './v1/routes'

const app = express()
dotenv.config()

const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req: Request, res: Response) => {
  return res.send('Express Typescript on Vercel')
})

routes(app)

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
