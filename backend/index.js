import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import connectDB from './utils/db.js'
import User from './models/User.js'

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello from backend' })
})

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, bio, interests, languagesKnown, languagesLearning, subscription } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already registered' })

    const user = new User({ name, email, password, bio, interests, languagesKnown, languagesLearning, subscription })
    await user.save()
    const userSafe = user.toObject()
    delete userSafe.password
    res.status(201).json(userSafe)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// List users (no passwords)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lingualink'

app.listen(PORT, async () => {
  try {
    await connectDB(MONGO_URI)
    console.log(`Backend running on http://localhost:${PORT}`)
  } catch (err) {
    console.error('Failed to connect to MongoDB, shutting down.')
    process.exit(1)
  }
})
