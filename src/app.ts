import express from 'express'
import cors from 'cors'
import favicon from 'express-favicon'
import logger from 'morgan'
import router from './routes/mainRouter'

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

export default app
