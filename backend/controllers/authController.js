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

export async function getUserById(req, res) {
  try {
    const { id } = req.params
    const user = await User.findById(id).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.userId
    const { name, bio, interests, languagesKnown, languagesLearning } = req.body

    // Validate input
    if (name && !name.trim()) {
      return res.status(400).json({ error: 'Name cannot be empty' })
    }

    // Build update object with only provided fields
    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (bio !== undefined) updateData.bio = bio.trim()
    if (interests !== undefined) updateData.interests = interests
    if (languagesKnown !== undefined) updateData.languagesKnown = languagesKnown
    if (languagesLearning !== undefined) updateData.languagesLearning = languagesLearning

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })

    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function deleteProfile(req, res) {
  try {
    const userId = req.user.userId
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ error: 'Password required to delete account' })
    }

    // Verify password
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Invalid password' })

    // Import models for cascade delete
    const Connection = (await import('../models/Connection.js')).default
    const Message = (await import('../models/Message.js')).default

    // Delete all connections
    await Connection.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }]
    })

    // Delete all messages
    await Message.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }]
    })

    // Delete user
    await User.findByIdAndDelete(userId)

    // Clear JWT cookie
    res.cookie('jwt', '', { httpOnly: true, maxAge: 0 })

    res.status(200).json({ message: 'Account deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
