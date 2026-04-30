import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'

import connectDB from './utils/db.js'
import User from './models/User.js'
import authRoutes from './routes/authRoutes.js'
import connectionRoutes from './routes/connectionRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import dictionaryRoutes from './routes/dictionaryRoutes.js'
import workspaceRoutes from './routes/workspaceRoutes.js'
import emailRoutes from './routes/emailRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import INTERESTS from './data/interests.js'
import { initializeDailyEmailSchedules, stopAllEmailSchedules } from './services/emailScheduler.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.json({ message: 'Hello from backend' })
})

app.use('/api/auth', authRoutes)
app.use('/api/connections', authMiddleware, connectionRoutes)
app.use('/api/messages', authMiddleware, messageRoutes)
app.use('/api/dictionary', authMiddleware, dictionaryRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/email', emailRoutes)

// Serve interests list to frontend
app.get('/api/interests', (req, res) => {
  res.json(INTERESTS)
})

// Get all users (protected)
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

const MONGO_URI = process.env.MONGO_URI

const server = app.listen(PORT, async () => {
  try {
    await connectDB(MONGO_URI)
    console.log(`Backend running on http://localhost:${PORT}`)
    
    // Initialize daily email schedules for all users with emails enabled
    await initializeDailyEmailSchedules()
  } catch (err) {
    console.error('Failed to connect to MongoDB, shutting down.')
    process.exit(1)
  }
})

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

app.locals.io = io

const onlineUsers = new Set()

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  if (userId) {
    socket.join(userId)
    onlineUsers.add(userId)
    io.emit('userOnline', userId)
    console.log(`User connected via socket: ${userId}`)
  }

  // Send initial list to the connected client
  socket.emit('onlineUsers', Array.from(onlineUsers))

  // Typing indicators
  socket.on('typing', ({ receiverId }) => {
    socket.to(receiverId).emit('userTyping', userId)
  })

  socket.on('stopTyping', ({ receiverId }) => {
    socket.to(receiverId).emit('userStopTyping', userId)
  })

  socket.on('disconnect', () => {
    if (userId) {
      const userRoom = io.sockets.adapter.rooms.get(userId)
      if (!userRoom || userRoom.size === 0) {
        onlineUsers.delete(userId)
        io.emit('userOffline', userId)
      }
      console.log(`User disconnected via socket: ${userId}`)
    }
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  stopAllEmailSchedules()
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  stopAllEmailSchedules()
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
