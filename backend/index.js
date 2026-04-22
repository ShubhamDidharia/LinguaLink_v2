import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import connectDB from './utils/db.js'
import User from './models/User.js'
import authRoutes from './routes/authRoutes.js'
import connectionRoutes from './routes/connectionRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import dictionaryRoutes from './routes/dictionaryRoutes.js'
import workspaceRoutes from './routes/workspaceRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import INTERESTS from './data/interests.js'

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

app.listen(PORT, async () => {
  try {
    await connectDB(MONGO_URI)
    console.log(`Backend running on http://localhost:${PORT}`)
  } catch (err) {
    console.error('Failed to connect to MongoDB, shutting down.')
    process.exit(1)
  }
})
