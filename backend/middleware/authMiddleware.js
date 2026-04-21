import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({ error: 'Unauthorized - no token' })
    
    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded) return res.status(401).json({ error: 'Unauthorized - invalid token' })

    const user = await User.findById(decoded.userId).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })

    req.user = decoded
    next()
  } catch (err) {
    console.error('Auth error:', err.message)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
