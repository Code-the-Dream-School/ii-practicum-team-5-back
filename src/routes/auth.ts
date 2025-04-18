import express from 'express'
const router = express.Router()
import { register, login, requestPasswordReset, resetPassword } from '../controllers/auth'

router.post('/register', register)
router.post('/login', login)
router.post('/request-reset-password', requestPasswordReset)
router.post('/reset-password', resetPassword)

export default router
