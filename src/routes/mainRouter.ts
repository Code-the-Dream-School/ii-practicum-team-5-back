import express from 'express'
import mainController from '../controllers/mainController'

const router = express.Router()

router.route('/').get(mainController)

export default router
