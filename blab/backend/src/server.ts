import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

import { errorHandler, notFound } from './middleware/errorMiddleware'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import customersRoutes from './routes/customersRoutes'
import productRoutes from './routes/productsRoutes'
import salesRoutes from './routes/salesRoutes'
import suppliersRoutes from './routes/suppliersRoutes'
import financeRoutes from './routes/financeRoutes'
import tasksRoutes from './routes/tasksRoutes'
import reportRoutes from './routes/reportRoutes'
import analyticsRoutes from './routes/analyticsRoutes'
import automationRoutes from './routes/automationRoutes'
import settingsRoutes from './routes/settingsRoutes'
import exportRoutes from './routes/exportRoutes'
import { setupEventListeners } from './services/eventService'
import { dataSyncService } from './services/dataSyncService'

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Rate limiting - More permissive for demo
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for demo - 1000 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
app.use(helmet()) // Security headers
app.use(limiter) // Rate limiting
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('combined')) // Request logging
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Blabmarket CRM API',
    version: '1.0.0'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/customers', customersRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/suppliers', suppliersRoutes)
app.use('/api/finance', financeRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/automation', automationRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/export', exportRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Blabmarket CRM API',
    version: '1.0.0',
    status: 'Active',
    documentation: '/api-docs'
  })
})

// Error handling middleware (must be last)
app.use(notFound)
app.use(errorHandler)

// Create HTTP server and initialize Socket.io
const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Store connected users
const connectedUsers = new Map<string, { socketId: string; userId: string; name: string }>()

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id)

  // Handle user authentication
  socket.on('authenticate', (userData: { userId: string; name: string }) => {
    connectedUsers.set(socket.id, {
      socketId: socket.id,
      userId: userData.userId,
      name: userData.name
    })
    console.log(`✅ User authenticated: ${userData.name} (${userData.userId})`)
    
    // Notify other users about new user
    socket.broadcast.emit('userJoined', {
      userId: userData.userId,
      name: userData.name,
      timestamp: new Date().toISOString()
    })
  })

  // Handle real-time notifications
  socket.on('sendNotification', (data: {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    targetUserId?: string // If specified, send only to specific user
  }) => {
    const sender = connectedUsers.get(socket.id)
    if (!sender) return

    const notification = {
      id: Date.now().toString(),
      type: data.type,
      title: data.title,
      message: data.message,
      timestamp: new Date().toISOString(),
      read: false,
      senderName: sender.name
    }

    if (data.targetUserId) {
      // Send to specific user
      const targetSocket = Array.from(connectedUsers.values())
        .find(user => user.userId === data.targetUserId)
      if (targetSocket) {
        io.to(targetSocket.socketId).emit('newNotification', notification)
      }
    } else {
      // Broadcast to all users except sender
      socket.broadcast.emit('newNotification', notification)
    }
  })

  // Handle system notifications (triggered by API calls)
  socket.on('systemNotification', (data: {
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    module: string
  }) => {
    const notification = {
      id: Date.now().toString(),
      type: data.type,
      title: data.title,
      message: data.message,
      timestamp: new Date().toISOString(),
      read: false,
      module: data.module
    }

    // Broadcast to all users
    io.emit('systemNotification', notification)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id)
    if (user) {
      console.log(`👋 User disconnected: ${user.name}`)
      connectedUsers.delete(socket.id)
      
      // Notify other users
      socket.broadcast.emit('userLeft', {
        userId: user.userId,
        name: user.name,
        timestamp: new Date().toISOString()
      })
    }
  })
})

// Make io available globally for use in routes
declare global {
  var socketIO: SocketIOServer
}
global.socketIO = io

// Start server
const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'

server.listen(PORT, () => {
  console.log(`🚀 Blabmarket CRM API Server running in ${NODE_ENV} mode on port ${PORT}`)
  console.log(`📚 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`)
  console.log(`💬 WebSocket server initialized`)
  console.log(`🌟 Environment file loaded: ${process.env.NODE_ENV}`)
  
  // Initialize event-driven data synchronization
  setupEventListeners()
  console.log(`🔄 Data Synchronization Service: ${dataSyncService.getSyncStatus().syncHealthy ? 'Healthy' : 'Error'}`)
})

export default app