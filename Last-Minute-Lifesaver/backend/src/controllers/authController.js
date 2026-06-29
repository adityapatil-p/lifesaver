import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Helper to generate JWT Token
const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required for authentication.')
  }

  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  })
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Product Lead',
    })

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          preferences: user.preferences,
        },
      })
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data provided' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          preferences: user.preferences,
        },
      })
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          preferences: user.preferences,
        },
      })
    } else {
      res.status(404).json({ success: false, error: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// @desc    Update user profile & preferences
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.role = req.body.role || user.role

      if (req.body.password) {
        user.password = req.body.password
      }

      if (req.body.preferences) {
        user.preferences = {
          ...user.preferences.toObject(),
          ...req.body.preferences,
        }
      }

      const updatedUser = await user.save()

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          plan: updatedUser.plan,
          preferences: updatedUser.preferences,
        },
      })
    } else {
      res.status(404).json({ success: false, error: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
