import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import favicon from 'express-favicon'
import logger from 'morgan'
import router from './routes/mainRouter'
import authRouter from './routes/auth'
import plansRouter from './routes/plans'
import accountRouter from './routes/account'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
import authMiddleware, { optionalAuthMiddleware } from './middlewares/authMiddleware'
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware'
import notFoundMiddleware from './middlewares/notFoundMiddleware'

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'))

// TODO: Should setup some security middlewares like: rate limiter, helmet, xss ...

// routes
app.use('/api/v1', router)
app.use('/api/v1/plans', optionalAuthMiddleware, plansRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/account', authMiddleware, accountRouter)

const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

export default app
