import jwt from 'jsonwebtoken'
import User from '../models/User.js'


export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {

      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is required for authentication.')
      }

      const decoded = jwt.verify(token, jwtSecret)

      // Get user from database (exclude password field)
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found, unauthorized' })
      }

      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Your session has expired. Please sign in again.',
      });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' })
  }
}
