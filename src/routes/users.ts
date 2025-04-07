import express from 'express'
import { dummyHandler } from '../controllers/dummyController.js'

const router = express.Router()

router.route('/').get(dummyHandler)

export default router
