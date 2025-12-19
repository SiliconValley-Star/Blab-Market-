import { Request, Response, NextFunction } from 'express'

// Custom error interface
interface ApiError extends Error {
  statusCode?: number
  isOperational?: boolean
}

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as ApiError
  error.statusCode = 404
  next(error)
}

// Error handler middleware
export const errorHandler = (
  err: ApiError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500
  let message = err.message

  // MongoDB CastError (for future use)
  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Resource not found'
  }

  // MongoDB Duplicate Key Error
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    statusCode = 400
    message = 'Duplicate field value entered'
  }

  // MongoDB Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values((err as any).errors).map((val: any) => val.message).join(', ')
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  // JWT Expired Error  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  // PostgreSQL Errors
  if ((err as any).code === '23505') { // Unique violation
    statusCode = 400
    message = 'Duplicate entry'
  }

  if ((err as any).code === '23503') { // Foreign key violation
    statusCode = 400
    message = 'Referenced resource does not exist'
  }

  if ((err as any).code === '23502') { // Not null violation
    statusCode = 400
    message = 'Required field is missing'
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      ...(process.env.NODE_ENV === 'development' && { originalError: err.message }),
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    }
  })
}

// Async error wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// Custom API Error class
export class CustomError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const