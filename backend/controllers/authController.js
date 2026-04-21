import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export async function signUp(req, res) {
  try {
    const { name, email, password, bio, interests, languagesKnown, languagesLearning, subscription } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ error: 'Email already registered' })

    const user = new User({ name, email, password, bio, interests, languagesKnown, languagesLearning, subscription })
    await user.save()

    const token = generateToken(user)
    const userSafe = user.toObject()
    delete userSafe.password
    res.status(201).json({ user: userSafe, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Invalid credentials' })

    const token = generateToken(user)
    const userSafe = user.toObject()
    delete userSafe.password
    res.json({ user: userSafe, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
