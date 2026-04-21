import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

function generateTokenAndSetCookie(userId, res) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: false
  })
}

export async function signUp(req, res) {
  try {
    const { name, email, password, bio, interests, languagesKnown, languagesLearning, subscription } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ error: 'Email already registered' })

    const user = new User({ name, email, password, bio, interests, languagesKnown, languagesLearning, subscription })
    await user.save()

    generateTokenAndSetCookie(user._id, res)
    const userSafe = user.toObject()
    delete userSafe.password
    res.status(201).json(userSafe)
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

    generateTokenAndSetCookie(user._id, res)
    const userSafe = user.toObject()
    delete userSafe.password
    res.json(userSafe)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function logout(req, res) {
  try {
    res.cookie('jwt', '', { httpOnly: true, maxAge: 0 })
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
