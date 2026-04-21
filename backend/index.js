import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import connectDB from './utils/db.js'
import User from './models/User.js'
import authRoutes from './routes/authRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello from backend' })
})

app.use('/api/auth', authRoutes)

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
