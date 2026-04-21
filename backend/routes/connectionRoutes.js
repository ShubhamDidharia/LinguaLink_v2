import express from 'express'
import {
  sendConnectionRequest,
  getPendingConnections,
  getAcceptedConnections,
  respondToConnectionRequest,
  getConnectionStatus
} from '../controllers/connectionController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', sendConnectionRequest)
router.get('/pending', getPendingConnections)
router.get('/accepted', getAcceptedConnections)
router.get('/status/:otherUserId', getConnectionStatus)
router.put('/:connectionId', respondToConnectionRequest)

export default router
