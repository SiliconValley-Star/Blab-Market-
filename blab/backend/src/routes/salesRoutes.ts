import { Router } from 'express'
import { Request, Response } from 'express'
import { asyncHandler, CustomError, HTTP_STATUS } from '../middleware/errorMiddleware'
import { authenticateToken } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/roleMiddleware'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// Mock sales opportunities data
const mockSalesOpportunities = [
  {
    id: '1',
    title: 'ABC İlaç - Yıllık Anlaşma',
    description: 'ABC İlaç A.Ş. ile 2024 yılı kapsamlı ilaç tedarik anlaşması',
    customerId: '1',
    customerName: 'ABC İlaç A.Ş.',
    contactPerson: 'Ahmet Yılmaz',
    value: 2500000,
    currency: 'TRY',
    probability: 85,
    stage: 'negotiation',
    priority: 'high',
    source: 'referral',
    assignedTo: '2',
    assignedToName: 'Satış Temsilcisi',
    expectedCloseDate: '2024-03-15',
    actualCloseDate: null,
    products: [
      { productId: '1', productName: 'Aspirin 500mg', quantity: 10000, unitPrice: 15.50 },
      { productId: '3', productName: 'Insulin Pen 100IU/ml', quantity: 500, unitPrice: 125.00 }
    ],
    competitors: ['XYZ İlaç', 'Global Pharma'],
    notes: 'Müşteri fiyat konusunda hassas, kalite odaklı yaklaşım sergilemeli',
    activities: [
      {
        id: '1',
        type: 'meeting',
        title: 'İlk görüşme',
        description: 'Müşteri ihtiyaçları belirlendi',
        date: '2024-01-15T10:00:00Z',
        performedBy: 'Satış Temsilcisi'
      },
      {
        id: '2',
        type: 'call',
        title: 'Fiyat görüşmesi',
        description: 'Fiyat teklifi sunuldu',
        date: '2024-01-22T14:30:00Z',
        performedBy: 'Satış Temsilcisi'
      }
    ],
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T14:30:00Z'
  },
  {
    id: '2',
    title: 'MediCenter - Tıbbi Cihaz Satışı',
    description: 'Yeni açılan tıp merkezine tıbbi cihaz tedariki',
    customerId: '2',
    customerName: 'Sağlık Merkezi XYZ',
    contactPerson: 'Dr. Fatma Kaya',
    value: 750000,
    currency: 'TRY',
    probability: 60,
    stage: 'proposal',
    priority: 'medium',
    source: 'website',
    assignedTo: '2',
    assignedToName: 'Satış Temsilcisi',
    expectedCloseDate: '2024-02-28',
    actualCloseDate: null,
    products: [
      { productId: '2', productName: 'Dijital Termometre DT-100', quantity: 50, unitPrice: 89.90 }
    ],
    competitors: ['MedTech Solutions'],
    notes: 'Yeni müşteri, referans iş olabilir',
    activities: [
      {
        id: '3',
        type: 'email',
        title: 'Ürün kataloğu gönderildi',
        description: 'Detaylı ürün bilgileri ve fiyat listesi paylaşıldı',
        date: '2024-01-18T11:15:00Z',
        performedBy: 'Satış Temsilcisi'
      }
    ],
    status: 'active',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-18T11:15:00Z'
  }
]

/**
 * @route   GET /api/sales
 * @desc    Get all sales opportunities
 * @access  Private
 */
router.get('/', requirePermission('sales', 'read'), asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    stage = '',
    priority = '',
    assignedTo = '',
    sortBy = 'updatedAt',
    sortOrder = 'desc'
  } = req.query

  let filteredOpportunities = [...mockSalesOpportunities]

  // Filter by search (title or customer name)
  if (search) {
    const searchLower = (search as string).toLowerCase()
    filteredOpportunities = filteredOpportunities.filter(opp =>
      opp.title.toLowerCase().includes(searchLower) ||
      opp.customerName.toLowerCase().includes(searchLower)
    )
  }

  // Filter by stage
  if (stage && stage !== 'all') {
    filteredOpportunities = filteredOpportunities.filter(opp => opp.stage === stage)
  }

  // Filter by priority
  if (priority && priority !== 'all') {
    filteredOpportunities = filteredOpportunities.filter(opp => opp.priority === priority)
  }

  // Filter by assigned person
  if (assignedTo && assignedTo !== 'all') {
    filteredOpportunities = filteredOpportunities.filter(opp => opp.assignedTo === assignedTo)
  }

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit)
  const endIndex = startIndex + Number(limit)
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, endIndex)

  // Calculate summary statistics
  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0)
  const weightedValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0)

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      opportunities: paginatedOpportunities,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(filteredOpportunities.length / Number(limit)),
        totalItems: filteredOpportunities.length,
        itemsPerPage: Number(limit)
      },
      summary: {
        totalOpportunities: mockSalesOpportunities.length,
        activeOpportunities: mockSalesOpportunities.filter(o => o.status === 'active').length,
        totalValue: totalValue,
        weightedValue: weightedValue,
        avgProbability: mockSalesOpportunities.reduce((sum, o) => sum + o.probability, 0) / mockSalesOpportunities.length
      }
    }
  })
}))

/**
 * @route   GET /api/sales/:id
 * @desc    Get sales opportunity by ID
 * @access  Private
 */
router.get('/:id', requirePermission('sales', 'read'), asyncHandler(async (req: Request, res: Response) => {
  const opportunity = mockSalesOpportunities.find(o => o.id === req.params.id)
  
  if (!opportunity) {
    throw new CustomError('Satış fırsatı bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { opportunity }
  })
}))

/**
 * @route   POST /api/sales
 * @desc    Create new sales opportunity
 * @access  Private
 */
router.post('/', requirePermission('sales', 'create'), asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    customerId,
    customerName,
    contactPerson,
    value,
    probability,
    stage,
    priority,
    source,
    expectedCloseDate,
    products,
    competitors,
    notes
  } = req.body

  // Basic validation
  if (!title || !customerId || typeof value !== 'number' || value < 0 || !expectedCloseDate) {
    throw new CustomError('Başlık, müşteri, değer (0 veya pozitif) ve tahmini kapanış tarihi alanları zorunludur', HTTP_STATUS.BAD_REQUEST)
  }

  const newOpportunity = {
    id: String(mockSalesOpportunities.length + 1),
    title,
    description: description || '',
    customerId,
    customerName: customerName || '',
    contactPerson: contactPerson || '',
    value: Number(value),
    currency: 'TRY',
    probability: Number(probability) || 50,
    stage: stage || 'prospecting',
    priority: priority || 'medium',
    source: source || 'other',
    assignedTo: req.user?.id || '',
    assignedToName: req.user?.firstName + ' ' + req.user?.lastName || '',
    expectedCloseDate,
    actualCloseDate: null,
    products: products || [],
    competitors: competitors || [],
    notes: notes || '',
    activities: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  mockSalesOpportunities.push(newOpportunity)

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Satış fırsatı başarıyla oluşturuldu',
    data: { opportunity: newOpportunity }
  })
}))

/**
 * @route   PUT /api/sales/:id
 * @desc    Update sales opportunity
 * @access  Private
 */
router.put('/:id', requirePermission('sales', 'update'), asyncHandler(async (req: Request, res: Response) => {
  const opportunityIndex = mockSalesOpportunities.findIndex(o => o.id === req.params.id)
  
  if (opportunityIndex === -1) {
    throw new CustomError('Satış fırsatı bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const updatedOpportunity = {
    ...mockSalesOpportunities[opportunityIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  }

  // If stage is changed to 'won' or 'lost', set actual close date
  if (req.body.stage === 'won' || req.body.stage === 'lost') {
    updatedOpportunity.actualCloseDate = new Date().toISOString()
    updatedOpportunity.status = 'closed'
  }

  mockSalesOpportunities[opportunityIndex] = updatedOpportunity

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Satış fırsatı başarıyla güncellendi',
    data: { opportunity: updatedOpportunity }
  })
}))

/**
 * @route   POST /api/sales/:id/activities
 * @desc    Add activity to sales opportunity
 * @access  Private
 */
router.post('/:id/activities', requirePermission('sales', 'update'), asyncHandler(async (req: Request, res: Response) => {
  const opportunityIndex = mockSalesOpportunities.findIndex(o => o.id === req.params.id)
  
  if (opportunityIndex === -1) {
    throw new CustomError('Satış fırsatı bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const { type, title, description } = req.body

  if (!type || !title) {
    throw new CustomError('Aktivite tipi ve başlık alanları zorunludur', HTTP_STATUS.BAD_REQUEST)
  }

  const newActivity = {
    id: String(Date.now()),
    type,
    title,
    description: description || '',
    date: new Date().toISOString(),
    performedBy: req.user?.firstName + ' ' + req.user?.lastName || 'Bilinmeyen'
  }

  mockSalesOpportunities[opportunityIndex].activities.push(newActivity)
  mockSalesOpportunities[opportunityIndex].updatedAt = new Date().toISOString()

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Aktivite başarıyla eklendi',
    data: { activity: newActivity }
  })
}))

/**
 * @route   DELETE /api/sales/:id
 * @desc    Delete sales opportunity
 * @access  Private
 */
router.delete('/:id', requirePermission('sales', 'delete'), asyncHandler(async (req: Request, res: Response) => {
  const opportunityIndex = mockSalesOpportunities.findIndex(o => o.id === req.params.id)
  
  if (opportunityIndex === -1) {
    throw new CustomError('Satış fırsatı bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const deletedOpportunity = mockSalesOpportunities[opportunityIndex]
  mockSalesOpportunities.splice(opportunityIndex, 1)

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Satış fırsatı başarıyla silindi',
    data: { opportunity: deletedOpportunity }
  })
}))

export default router