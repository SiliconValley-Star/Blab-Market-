import { Request, Response, NextFunction } from 'express'
import { CustomError, HTTP_STATUS } from './errorMiddleware'

/**
 * Check if user has required permission for a resource
 */
export const requirePermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError('Kimlik doğrulama gereklidir', HTTP_STATUS.UNAUTHORIZED)
    }

    const userPermissions = req.user.role.permissions[resource]
    
    if (!userPermissions || !userPermissions.includes(action)) {
      throw new CustomError('Bu işlem için yetkiniz bulunmuyor', HTTP_STATUS.FORBIDDEN)
    }

    next()
  }
}

/**
 * Check if user has one of the required roles
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError('Kimlik doğrulama gereklidir', HTTP_STATUS.UNAUTHORIZED)
    }

    if (!roles.includes(req.user.role.name)) {
      throw new CustomError('Bu işlem için yetkili rol gereklidir', HTTP_STATUS.FORBIDDEN)
    }

    next()
  }
}

/**
 * Check if user is admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new CustomError('Kimlik doğrulama gereklidir', HTTP_STATUS.UNAUTHORIZED)
  }

  if (req.user.role.name !== 'admin') {
    throw new CustomError('Bu işlem için admin yetkisi gereklidir', HTTP_STATUS.FORBIDDEN)
  }

  next()
}

/**
 * Check if user can access own data or is admin
 */
export const requireOwnershipOrAdmin = (userIdParam: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError('Kimlik doğrulama gereklidir', HTTP_STATUS.UNAUTHORIZED)
    }

    const targetUserId = req.params[userIdParam]
    const isOwner = req.user.id === targetUserId
    const isAdmin = req.user.role.name === 'admin'

    if (!isOwner && !isAdmin) {
      throw new CustomError('Bu veriye erişim yetkiniz bulunmuyor', HTTP_STATUS.FORBIDDEN)
    }

    next()
  }
}

/**
 * Permission helper functions
 */
export const hasPermission = (user: any, resource: string, action: string): boolean => {
  if (!user || !user.role || !user.role.permissions) {
    return false
  }

  const permissions = user.role.permissions[resource]
  return permissions && permissions.includes(action)
}

export const hasRole = (user: any, ...roles: string[]): boolean => {
  if (!user || !user.role) {
    return false
  }

  return roles.includes(user.role.name)
}

export const isAdmin = (user: any): boolean => {
  return hasRole(user, 'admin')
}

/**
 * Role-based route access definitions
 */
export const ROLE_PERMISSIONS = {
  admin: {
    users: ['create', 'read', 'update', 'delete'],
    customers: ['create', 'read', 'update', 'delete'],
    products: ['create', 'read', 'update', 'delete'],
    sales: ['create', 'read', 'update', 'delete'],
    finance: ['create', 'read', 'update', 'delete'],
    procurement: ['create', 'read', 'update', 'delete'],
    tasks: ['create', 'read', 'update', 'delete'],
    reports: ['create', 'read', 'update', 'delete'],
    settings: ['create', 'read', 'update', 'delete']
  },
  sales_team: {
    customers: ['create', 'read', 'update'],
    sales: ['create', 'read', 'update'],
    tasks: ['create', 'read', 'update'],
    reports: ['read']
  },
  finance_team: {
    finance: ['create', 'read', 'update'],
    customers: ['read'],
    sales: ['read'],
    reports: ['read']
  },
  import_export_team: {
    products: ['create', 'read', 'update'],
    suppliers: ['create', 'read', 'update'],
    procurement: ['create', 'read', 'update'],
    customers: ['read'],
    reports: ['read']
  },
  support_team: {
    customers: ['read', 'update'],
    tasks: ['create', 'read', 'update'],
    reports: ['read']
  }
} as const

/**
 * Middleware to check multiple permissions (OR logic)
 */
export const requireAnyPermission = (permissions: Array<{resource: string, action: string}>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError('Kimlik doğrulama gereklidir', HTTP_STATUS.UNAUTHORIZED)
    }

    const hasAnyPermission = permissions.some(({ resource, action }) => 
      hasPermission(req.user, resource, action)
    )

    if (!hasAnyPermission) {
      throw new CustomError('Bu işlem için gerekli yetkilerden hiçbirine sahip değilsiniz', HTTP_STATUS.FORBIDDEN)
    }

    next()
  }
}

/**
 * Middleware to check multiple permissions (AND logic)
 */
export const requireAllPermissions = (permissions: Array<{resource: string, action: string}>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError('Kimlik doğrulama gereklidir', HTTP_STATUS.UNAUTHORIZED)
    }

    const hasAllPermissions = permissions.every(({ resource, action }) => 
      hasPermission(req.user, resource, action)
    )

    if (!hasAllPermissions) {
      throw new CustomError('Bu işlem için tüm gerekli yetkileriniz bulunmuyor', HTTP_STATUS.FORBIDDEN)
    }

    next()
  }
}