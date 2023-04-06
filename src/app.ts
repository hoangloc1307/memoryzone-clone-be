import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import routes from './v1/routes'
import errorMiddleware from './v1/middlewares/error.middleware'

const app = express()
dotenv.config()

const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

routes(app)

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
