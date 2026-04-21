import express from 'express'
import { signUp, login, logout, getMe, getUserById, updateProfile, deleteProfile } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authMiddleware, getMe)
router.get('/users/:id', getUserById)
router.put('/profile', authMiddleware, updateProfile)
router.delete('/profile', authMiddleware, deleteProfile)

export default router
