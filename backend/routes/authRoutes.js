import express from 'express'
import { signUp, login, logout, getMe, getUserById } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authMiddleware, getMe)
router.get('/users/:id', getUserById)

export default router
