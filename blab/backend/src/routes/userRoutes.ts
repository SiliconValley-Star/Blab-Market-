import { Router } from 'express'
import { Request, Response } from 'express'
import { asyncHandler, HTTP_STATUS, CustomError } from '../middleware/errorMiddleware'
import { authenticateToken } from '../middleware/authMiddleware'

const router = Router()

// Mock users data - same as in authMiddleware and authRoutes
const mockUsers = [
  {
    id: '1',
    email: 'admin@blabmarket.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+90 212 555 0001',
    address: 'İstanbul, Türkiye',
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
    password: 'satis123',
    firstName: 'Satış',
    lastName: 'Temsilcisi',
    phone: '+90 212 555 0002',
    address: 'Ankara, Türkiye',
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
    password: 'finans123',
    firstName: 'Finans',
    lastName: 'Uzmanı',
    phone: '+90 212 555 0003',
    address: 'İzmir, Türkiye',
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
    password: 'ithalat123',
    firstName: 'İthalat',
    lastName: 'Uzmanı',
    phone: '+90 212 555 0004',
    address: 'Bursa, Türkiye',
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
    password: 'destek123',
    firstName: 'Destek',
    lastName: 'Uzmanı',
    phone: '+90 212 555 0005',
    address: 'Antalya, Türkiye',
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
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Users endpoint - henüz implement edilmedi',
    data: []
  })
}))

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new CustomError('Kullanıcı bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const { firstName, lastName, email, phone, address } = req.body

  // Find user in mock data
  const userIndex = mockUsers.findIndex(u => u.id === req.user!.id)
  if (userIndex === -1) {
    throw new CustomError('Kullanıcı bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  // Validate email uniqueness (if changed)
  if (email !== mockUsers[userIndex].email) {
    const emailExists = mockUsers.find(u => u.email === email && u.id !== req.user!.id)
    if (emailExists) {
      throw new CustomError('Bu e-posta adresi zaten kullanılmaktadır', HTTP_STATUS.BAD_REQUEST)
    }
  }

  // Update user data
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    firstName: firstName || mockUsers[userIndex].firstName,
    lastName: lastName || mockUsers[userIndex].lastName,
    email: email || mockUsers[userIndex].email,
    phone: phone || mockUsers[userIndex].phone,
    address: address || mockUsers[userIndex].address,
  }

  // Remove password from response
  const { password: _, ...updatedUser } = mockUsers[userIndex]

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profil başarıyla güncellendi',
    data: {
      user: updatedUser
    }
  })
}))

/**
 * @route   PUT /api/users/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new CustomError('Kullanıcı bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const { currentPassword, newPassword } = req.body

  // Validation
  if (!currentPassword || !newPassword) {
    throw new CustomError('Mevcut şifre ve yeni şifre gereklidir', HTTP_STATUS.BAD_REQUEST)
  }

  if (newPassword.length < 6) {
    throw new CustomError('Yeni şifre en az 6 karakter olmalıdır', HTTP_STATUS.BAD_REQUEST)
  }

  // Find user in mock data
  const userIndex = mockUsers.findIndex(u => u.id === req.user!.id)
  if (userIndex === -1) {
    throw new CustomError('Kullanıcı bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  // Check current password
  if (currentPassword !== mockUsers[userIndex].password) {
    throw new CustomError('Mevcut şifre yanlış', HTTP_STATUS.BAD_REQUEST)
  }

  // Update password
  mockUsers[userIndex].password = newPassword

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Şifre başarıyla güncellendi'
  })
}))

export default router