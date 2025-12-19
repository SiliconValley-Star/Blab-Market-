import { Router } from 'express'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { asyncHandler, CustomError, HTTP_STATUS } from '../middleware/errorMiddleware'
import { authenticateToken } from '../middleware/authMiddleware'

const router = Router()

// Mock users data - replace with database in production
const mockUsers = [
  {
    id: '1',
    email: 'admin@blabmarket.com',
    password: 'admin123', // Will be compared directly for demo
    firstName: 'Admin',
    lastName: 'User',
    role: {
      id: 1,
      name: 'admin',
      permissions: {
        users: ['create', 'read', 'update', 'delete'],
        customers: ['create', 'read', 'update', 'delete'],
        products: ['create', 'read', 'update', 'delete'],
        sales: ['create', 'read', 'update', 'delete'],
        suppliers: ['create', 'read', 'update', 'delete'],
        finance: ['create', 'read', 'update', 'delete'],
        tasks: ['create', 'read', 'update', 'delete'],
        reports: ['create', 'read', 'update', 'delete'],
        settings: ['create', 'read', 'update', 'delete']
      }
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'satis@blabmarket.com',
    password: 'satis123', // Will be compared directly for demo
    firstName: 'Satış',
    lastName: 'Temsilcisi',
    role: {
      id: 2,
      name: 'sales_team',
      permissions: {
        customers: ['create', 'read', 'update'],
        sales: ['create', 'read', 'update'],
        tasks: ['create', 'read', 'update'],
        reports: ['read']
      }
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'finans@blabmarket.com',
    password: 'finans123', // Will be compared directly for demo
    firstName: 'Finans',
    lastName: 'Uzmanı',
    role: {
      id: 3,
      name: 'finance_team',
      permissions: {
        finance: ['create', 'read', 'update'],
        customers: ['read'],
        tasks: ['create', 'read', 'update'],
        reports: ['read']
      }
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    email: 'ithalat@blabmarket.com',
    password: 'ithalat123', // Will be compared directly for demo
    firstName: 'İthalat',
    lastName: 'Uzmanı',
    role: {
      id: 4,
      name: 'import_export_team',
      permissions: {
        products: ['create', 'read', 'update'],
        suppliers: ['create', 'read', 'update'],
        procurement: ['create', 'read', 'update'],
        tasks: ['create', 'read', 'update'],
        reports: ['read']
      }
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    email: 'destek@blabmarket.com',
    password: 'destek123', // Will be compared directly for demo
    firstName: 'Destek',
    lastName: 'Uzmanı',
    role: {
      id: 5,
      name: 'support_team',
      permissions: {
        customers: ['read', 'update'],
        tasks: ['create', 'read', 'update'],
        reports: ['read']
      }
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  }
]

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
  
  const accessToken = jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: '15m' }
  )
  
  const refreshToken = jwt.sign(
    { userId },
    refreshSecret,
    { expiresIn: '7d' }
  )
  
  return { accessToken, refreshToken }
}

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Validation
  if (!email || !password) {
    throw new CustomError('E-posta ve şifre gereklidir', HTTP_STATUS.BAD_REQUEST)
  }

  // Find user
  const user = mockUsers.find(u => u.email === email)
  if (!user) {
    throw new CustomError('Geçersiz e-posta veya şifre', HTTP_STATUS.UNAUTHORIZED)
  }

  // Check password - using direct comparison for demo
  const isPasswordValid = password === user.password
  if (!isPasswordValid) {
    throw new CustomError('Geçersiz e-posta veya şifre', HTTP_STATUS.UNAUTHORIZED)
  }

  // Check if user is active
  if (!user.isActive) {
    throw new CustomError('Hesabınız deaktif durumda', HTTP_STATUS.UNAUTHORIZED)
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id)

  // Remove password from response
  const { password: _, ...userResponse } = user

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Giriş başarılı',
    data: {
      user: userResponse,
      accessToken,
      refreshToken
    }
  })
}))

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw new CustomError('Refresh token gereklidir', HTTP_STATUS.BAD_REQUEST)
  }

  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
    const decoded = jwt.verify(refreshToken, refreshSecret) as any
    const user = mockUsers.find(u => u.id === decoded.userId)

    if (!user) {
      throw new CustomError('Geçersiz refresh token', HTTP_STATUS.UNAUTHORIZED)
    }

    const tokens = generateTokens(user.id)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: tokens
    })
  } catch (error) {
    throw new CustomError('Geçersiz refresh token', HTTP_STATUS.UNAUTHORIZED)
  }
}))

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  // In a real application, you might want to blacklist the token
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Çıkış yapıldı'
  })
}))

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new CustomError('Kullanıcı bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      user: req.user
    }
  })
}))

export default router