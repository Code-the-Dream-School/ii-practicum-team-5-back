import express from 'express'
import cors from 'cors'
import favicon from 'express-favicon'
import logger from 'morgan'
import apiRouter from './routes/index.js'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'))

app.use('/api/v1', apiRouter)

const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

export default app
