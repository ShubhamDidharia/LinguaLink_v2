import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

export default async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' })
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    // Attach user id and optionally fetch user
    req.user = { id: decoded.id, email: decoded.email }
    // Optionally fetch user document
    // req.userDoc = await User.findById(decoded.id).select('-password')
    next()
  } catch (err) {
    console.error('Auth error', err.message)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
