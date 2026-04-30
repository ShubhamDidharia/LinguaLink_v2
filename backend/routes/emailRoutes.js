import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { toggleDailyEmail, getDailyEmailStatus } from '../controllers/emailController.js'

const router = express.Router()

// Protected routes - require authentication
router.post('/toggle-daily', authMiddleware, toggleDailyEmail)
router.get('/daily-status', authMiddleware, getDailyEmailStatus)

export default router
