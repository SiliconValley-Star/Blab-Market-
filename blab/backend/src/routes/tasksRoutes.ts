import express from 'express'
import { authenticateToken } from '../middleware/authMiddleware'

const router = express.Router()

// Mock data for tasks
const mockTasks = [
  {
    id: 'task-1',
    title: 'Müşteri Raporu Hazırla',
    description: 'Q4 müşteri analiz raporunu hazırla ve sunuma hazırlan',
    status: 'in_progress',
    priority: 'high',
    category: 'report',
    assignedTo: 'user-2',
    assignedToName: 'Ahmet Yılmaz',
    createdBy: 'user-1',
    createdByName: 'Admin User',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-16T14:30:00.000Z',
    dueDate: '2024-01-20T17:00:00.000Z',
    estimatedHours: 8,
    actualHours: 4.5,
    tags: ['report', 'analysis', 'customer'],
    attachments: [],
    comments: [
      {
        id: 'comment-1',
        userId: 'user-2',
        userName: 'Ahmet Yılmaz',
        content: 'Rapor verilerini toplamaya başladım. Yarın tamamlanacak.',
        createdAt: '2024-01-16T14:30:00.000Z'
      }
    ],
    workflow: {
      id: 'wf-1',
      name: 'Rapor Hazırlama Süreci',
      currentStep: 'analysis',
      steps: ['planning', 'analysis', 'review', 'approval']
    }
  },
  {
    id: 'task-2',
    title: 'Yeni Ürün Lansmanı',
    description: 'Yeni ürün lansmanı için pazarlama stratejisi geliştirilmesi',
    status: 'todo',
    priority: 'urgent',
    category: 'marketing',
    assignedTo: 'user-3',
    assignedToName: 'Fatma Demir',
    createdBy: 'user-1',
    createdByName: 'Admin User',
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-10T10:00:00.000Z',
    dueDate: '2024-01-25T17:00:00.000Z',
    estimatedHours: 16,
    actualHours: 0,
    tags: ['marketing', 'product', 'launch'],
    attachments: [],
    comments: [],
    workflow: null
  },
  {
    id: 'task-3',
    title: 'Stok Sayımı',
    description: 'Aylık stok sayımının yapılması ve raporlanması',
    status: 'completed',
    priority: 'medium',
    category: 'inventory',
    assignedTo: 'user-4',
    assignedToName: 'Mehmet Can',
    createdBy: 'user-1',
    createdByName: 'Admin User',
    createdAt: '2024-01-01T09:00:00.000Z',
    updatedAt: '2024-01-15T16:00:00.000Z',
    dueDate: '2024-01-15T17:00:00.000Z',
    estimatedHours: 4,
    actualHours: 3.5,
    tags: ['inventory', 'monthly'],
    attachments: [],
    comments: [
      {
        id: 'comment-2',
        userId: 'user-4',
        userName: 'Mehmet Can',
        content: 'Stok sayımı tamamlandı. Rapor hazırlandı.',
        createdAt: '2024-01-15T16:00:00.000Z'
      }
    ],
    workflow: null
  }
]

// Mock data for workflows
const mockWorkflows = [
  {
    id: 'wf-1',
    name: 'Rapor Hazırlama Süreci',
    description: 'Standart rapor hazırlama iş akışı',
    status: 'active',
    steps: [
      {
        id: 'step-1',
        name: 'planning',
        title: 'Planlama',
        description: 'Rapor kapsamı ve hedeflerin belirlenmesi',
        order: 1,
        assigneeRole: 'analyst',
        estimatedDays: 1,
        required: true
      },
      {
        id: 'step-2',
        name: 'analysis',
        title: 'Analiz',
        description: 'Veri toplama ve analiz yapılması',
        order: 2,
        assigneeRole: 'analyst',
        estimatedDays: 3,
        required: true
      },
      {
        id: 'step-3',
        name: 'review',
        title: 'İnceleme',
        description: 'Raporun kalite kontrolü ve incelenmesi',
        order: 3,
        assigneeRole: 'supervisor',
        estimatedDays: 1,
        required: true
      },
      {
        id: 'step-4',
        name: 'approval',
        title: 'Onay',
        description: 'Final onayının alınması',
        order: 4,
        assigneeRole: 'manager',
        estimatedDays: 1,
        required: true
      }
    ],
    triggers: [
      {
        event: 'task_created',
        condition: 'category == "report"',
        action: 'assign_workflow'
      }
    ],
    createdBy: 'user-1',
    createdAt: '2024-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z'
  },
  {
    id: 'wf-2',
    name: 'Müşteri Onboarding',
    description: 'Yeni müşteri kabul süreci',
    status: 'active',
    steps: [
      {
        id: 'step-5',
        name: 'initial_contact',
        title: 'İlk İletişim',
        description: 'Müşteri ile ilk iletişim kurulması',
        order: 1,
        assigneeRole: 'sales',
        estimatedDays: 1,
        required: true
      },
      {
        id: 'step-6',
        name: 'documentation',
        title: 'Dokümantasyon',
        description: 'Gerekli belgelerin toplanması',
        order: 2,
        assigneeRole: 'admin',
        estimatedDays: 2,
        required: true
      },
      {
        id: 'step-7',
        name: 'setup',
        title: 'Sistem Kurulumu',
        description: 'Müşteri hesabının sistem kurulumu',
        order: 3,
        assigneeRole: 'tech',
        estimatedDays: 1,
        required: true
      },
      {
        id: 'step-8',
        name: 'training',
        title: 'Eğitim',
        description: 'Müşteri eğitiminin verilmesi',
        order: 4,
        assigneeRole: 'support',
        estimatedDays: 1,
        required: false
      }
    ],
    triggers: [
      {
        event: 'customer_created',
        condition: 'status == "new"',
        action: 'create_onboarding_tasks'
      }
    ],
    createdBy: 'user-1',
    createdAt: '2024-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z'
  }
]

// Mock users for assignment
const mockUsers = [
  { id: 'user-1', name: 'Admin User', role: 'admin' },
  { id: 'user-2', name: 'Ahmet Yılmaz', role: 'analyst' },
  { id: 'user-3', name: 'Fatma Demir', role: 'sales' },
  { id: 'user-4', name: 'Mehmet Can', role: 'supervisor' },
  { id: 'user-5', name: 'Ayşe Kara', role: 'manager' }
]

// Helper functions
const generateId = () => `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
const generateCommentId = () => `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Get all tasks with filtering, sorting, and pagination
router.get('/', authenticateToken, (req, res) => {
  try {
    const {
      search = '',
      status = 'all',
      priority = 'all',
      category = 'all',
      assignedTo = 'all',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    let filteredTasks = [...mockTasks]

    // Apply filters
    if (search) {
      const searchTerm = search.toString().toLowerCase()
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    if (status && status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === status)
    }

    if (priority && priority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priority)
    }

    if (category && category !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.category === category)
    }

    if (assignedTo && assignedTo !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === assignedTo)
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a]
      let bValue = b[sortBy as keyof typeof b]

      if (typeof aValue === 'string') aValue = aValue.toLowerCase()
      if (typeof bValue === 'string') bValue = bValue.toLowerCase()

      if (sortOrder === 'asc') {
        return (aValue || 0) < (bValue || 0) ? -1 : (aValue || 0) > (bValue || 0) ? 1 : 0
      } else {
        return (aValue || 0) > (bValue || 0) ? -1 : (aValue || 0) < (bValue || 0) ? 1 : 0
      }
    })

    // Apply pagination
    const pageNum = parseInt(page.toString())
    const limitNum = parseInt(limit.toString())
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = pageNum * limitNum

    const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

    // Calculate summary statistics
    const summary = {
      totalTasks: mockTasks.length,
      todoTasks: mockTasks.filter(t => t.status === 'todo').length,
      inProgressTasks: mockTasks.filter(t => t.status === 'in_progress').length,
      completedTasks: mockTasks.filter(t => t.status === 'completed').length,
      overdueTasks: mockTasks.filter(t => 
        new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length
    }

    res.json({
      success: true,
      data: {
        tasks: paginatedTasks,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredTasks.length / limitNum),
          totalItems: filteredTasks.length,
          itemsPerPage: limitNum
        },
        summary
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görevler alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get single task by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const task = mockTasks.find(t => t.id === id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Görev bulunamadı'
      })
    }

    res.json({
      success: true,
      data: { task }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görev alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Create new task
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      title,
      description,
      priority = 'medium',
      category,
      assignedTo,
      dueDate,
      estimatedHours,
      tags = [],
      workflowId
    } = req.body

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Görev başlığı ve açıklama zorunludur'
      })
    }

    const assignedUser = assignedTo ? mockUsers.find(u => u.id === assignedTo) : null
    const workflow = workflowId ? mockWorkflows.find(w => w.id === workflowId) : null

    const newTask = {
      id: generateId(),
      title,
      description,
      status: 'todo',
      priority,
      category: category || 'general',
      assignedTo: assignedTo || null,
      assignedToName: assignedUser ? assignedUser.name : null,
      createdBy: req.user?.id || 'unknown',
      createdByName: `${req.user?.firstName} ${req.user?.lastName}` || 'Unknown User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: dueDate || null,
      estimatedHours: estimatedHours || 0,
      actualHours: 0,
      tags: Array.isArray(tags) ? tags : [],
      attachments: [],
      comments: [],
      workflow: workflow ? {
        id: workflow.id,
        name: workflow.name,
        currentStep: workflow.steps[0].name,
        steps: workflow.steps.map(s => s.name)
      } : null
    }

    mockTasks.unshift(newTask as any)

    res.status(201).json({
      success: true,
      data: { task: newTask },
      message: 'Görev başarıyla oluşturuldu'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görev oluşturulurken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Update task
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const taskIndex = mockTasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Görev bulunamadı'
      })
    }

    const {
      title,
      description,
      status,
      priority,
      category,
      assignedTo,
      dueDate,
      estimatedHours,
      actualHours,
      tags
    } = req.body

    const assignedUser = assignedTo ? mockUsers.find(u => u.id === assignedTo) : null

    // Update task
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(category && { category }),
      ...(assignedTo !== undefined && { 
        assignedTo, 
        assignedToName: assignedUser ? assignedUser.name : null 
      }),
      ...(dueDate !== undefined && { dueDate }),
      ...(estimatedHours !== undefined && { estimatedHours }),
      ...(actualHours !== undefined && { actualHours }),
      ...(tags && { tags: Array.isArray(tags) ? tags : [] }),
      updatedAt: new Date().toISOString()
    }

    res.json({
      success: true,
      data: { task: mockTasks[taskIndex] },
      message: 'Görev başarıyla güncellendi'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görev güncellenirken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Delete task
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const taskIndex = mockTasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Görev bulunamadı'
      })
    }

    mockTasks.splice(taskIndex, 1)

    res.json({
      success: true,
      message: 'Görev başarıyla silindi'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görev silinirken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Add comment to task
router.post('/:id/comments', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body
    const taskIndex = mockTasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Görev bulunamadı'
      })
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Yorum içeriği zorunludur'
      })
    }

    const newComment = {
      id: generateCommentId(),
      userId: req.user?.id || 'unknown',
      userName: `${req.user?.firstName} ${req.user?.lastName}` || 'Unknown User',
      content: content.trim(),
      createdAt: new Date().toISOString()
    }

    mockTasks[taskIndex].comments.push(newComment)
    mockTasks[taskIndex].updatedAt = new Date().toISOString()

    res.status(201).json({
      success: true,
      data: { comment: newComment },
      message: 'Yorum başarıyla eklendi'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum eklenirken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get task comments
router.get('/:id/comments', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const task = mockTasks.find(t => t.id === id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Görev bulunamadı'
      })
    }

    res.json({
      success: true,
      data: { comments: task.comments }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorumlar alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Update task status
router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const taskIndex = mockTasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Görev bulunamadı'
      })
    }

    if (!['todo', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz durum değeri'
      })
    }

    mockTasks[taskIndex].status = status
    mockTasks[taskIndex].updatedAt = new Date().toISOString()

    // If task has workflow, update current step
    if (mockTasks[taskIndex].workflow && status === 'in_progress') {
      const workflow = mockWorkflows.find(w => w.id === mockTasks[taskIndex].workflow?.id)
      if (workflow) {
        const currentStepIndex = workflow.steps.findIndex(s => s.name === mockTasks[taskIndex].workflow?.currentStep)
        if (currentStepIndex >= 0 && currentStepIndex < workflow.steps.length - 1) {
          if (mockTasks[taskIndex].workflow) {
            mockTasks[taskIndex].workflow.currentStep = workflow.steps[currentStepIndex + 1].name
          }
        }
      }
    }

    res.json({
      success: true,
      data: { task: mockTasks[taskIndex] },
      message: 'Görev durumu başarıyla güncellendi'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Görev durumu güncellenirken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get dashboard data
router.get('/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const now = new Date()
    
    const dashboardData = {
      totalTasks: mockTasks.length,
      todoTasks: mockTasks.filter(t => t.status === 'todo').length,
      inProgressTasks: mockTasks.filter(t => t.status === 'in_progress').length,
      completedTasks: mockTasks.filter(t => t.status === 'completed').length,
      overdueTasks: mockTasks.filter(t => 
        new Date(t.dueDate) < now && t.status !== 'completed'
      ).length,
      highPriorityTasks: mockTasks.filter(t => 
        (t.priority === 'high' || t.priority === 'urgent') && t.status !== 'completed'
      ).length,
      myTasks: mockTasks.filter(t => t.assignedTo === req.user?.id).length,
      recentTasks: mockTasks
        .filter(t => t.assignedTo === req.user?.id)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
      tasksByCategory: mockTasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      tasksByPriority: mockTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    res.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get available users for assignment
router.get('/users/assignable', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: { users: mockUsers }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcılar alınırken hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router