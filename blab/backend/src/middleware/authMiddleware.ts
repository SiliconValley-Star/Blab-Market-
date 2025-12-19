import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { CustomError, HTTP_STATUS } from './errorMiddleware'

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        firstName: string
        lastName: string
        role: {
          id: number
          name: string
          permissions: any
        }
        isActive: boolean
        createdAt: string
      }
    }
  }
}

// Mock users data (same as in authRoutes.ts)
const mockUsers = [
  {
    id: '1',
    email: 'admin@blabmarket.com',
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
        finance: ['create', 'read', 'update', 'delete'],
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
    firstName: 'Finans',
    lastName: 'Uzmanı',
    role: {
      id: 3,
      name: 'finance_team',
      permissions: {
        finance: ['create', 'read', 'update'],
        customers: ['read'],
        reports: ['read']
      }
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    email: 'ithalat@blabmarket.com',
    firstName: 'İthalat',
    lastName: 'Uzmanı',
    role: {
      id: 4,
      name: 'import_export_team',
      permissions: {
        products: ['create', 'read', 'update'],
        procurement: ['create', 'read', 'update'],
        reports: ['read']
      }
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    email: 'destek@blabmarket.com',
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

/**
 * Authentication middleware to verify JWT token
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    throw new CustomError('Erişim token\'ı gereklidir', HTTP_STATUS.UNAUTHORIZED)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    
    // Find user by ID
    const user = mockUsers.find(u => u.id === decoded.userId)
    
    if (!user) {
      throw new CustomError('Geçersiz token', HTTP_STATUS.UNAUTHORIZED)
    }

    if (!user.isActive) {
      throw new CustomError('Hesap deaktif durumda', HTTP_STATUS.UNAUTHORIZED)
    }

    // Remove sensitive data and attach user to request
    const userWithoutPassword = user as any
    req.user = userWithoutPassword
    
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new CustomError('Geçersiz token', HTTP_STATUS.UNAUTHORIZED)
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new CustomError('Token süresi dolmuş', HTTP_STATUS.UNAUTHORIZED)
    }
    throw error
  }
}

/**
 * Optional authentication middleware - doesn't throw error if no token
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next() // Continue without user
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    const user = mockUsers.find(u => u.id === decoded.userId)
    
    if (user && user.isActive) {
      const userWithoutPassword = user as any
      req.user = userWithoutPassword
    }
  } catch (error) {
    // Ignore token errors in optional auth
  }

  next()
}