import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { toggleDailyEmail, getDailyEmailStatus, sendTestEmail } from '../controllers/emailController.js'

const router = express.Router()

// Protected routes - require authentication
router.post('/toggle-daily', authMiddleware, toggleDailyEmail)
router.get('/daily-status', authMiddleware, getDailyEmailStatus)
router.post('/test', authMiddleware, sendTestEmail)

export default router
