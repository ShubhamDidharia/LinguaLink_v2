import express from 'express'
import {
  sendMessage,
  getMessages,
  markAsRead,
  getConversations
} from '../controllers/messageController.js'

const router = express.Router()

router.post('/', sendMessage)
router.get('/conversations', getConversations)
router.get('/:otherUserId', getMessages)
router.put('/:otherUserId/read', markAsRead)

export default router
