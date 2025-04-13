import express from 'express'
import cors from 'cors'
import favicon from 'express-favicon'
import logger from 'morgan'
import router from './routes/mainRouter'
import plansRouter from './routes/plans'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
import userRouter from "./routes/user";

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'))

// routes
app.use('/api/v1', router)
app.use('/api/v1/user', userRouter);
app.use('/api/v1/plans', plansRouter)

const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

export default app
