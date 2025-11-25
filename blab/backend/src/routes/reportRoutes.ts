import { Router } from 'express'
import { Request, Response } from 'express'
import { asyncHandler, HTTP_STATUS } from '../middleware/errorMiddleware'

const router = Router()

// Mock veriler - üretim ortamında veritabanından gelecek
const mockReports = [
  {
    id: '1',
    name: 'Aylık Satış Raporu',
    type: 'sales',
    description: 'Aylık satış performansını gösteren detaylı rapor',
    category: 'operational',
    createdBy: 'admin',
    createdByName: 'Admin User',
    createdAt: new Date('2024-01-15').toISOString(),
    lastGenerated: new Date('2024-02-01').toISOString(),
    parameters: {
      period: 'monthly',
      includeComparison: true,
      breakdown: 'category'
    },
    isScheduled: true,
    scheduleFrequency: 'monthly'
  },
  {
    id: '2',
    name: 'Müşteri Analiz Raporu',
    type: 'customer',
    description: 'Müşteri davranışları ve segmentasyon analizi',
    category: 'analytics',
    createdBy: 'sales_manager',
    createdByName: 'Satış Müdürü',
    createdAt: new Date('2024-01-20').toISOString(),
    lastGenerated: new Date('2024-01-25').toISOString(),
    parameters: {
      segmentation: true,
      geographicBreakdown: true,
      behavioral: true
    },
    isScheduled: false,
    scheduleFrequency: null
  },
  {
    id: '3',
    name: 'Envanter Durum Raporu',
    type: 'inventory',
    description: 'Stok seviyeleri ve envanter dönüş analitiği',
    category: 'operational',
    createdBy: 'warehouse_manager',
    createdByName: 'Depo Müdürü',
    createdAt: new Date('2024-01-10').toISOString(),
    lastGenerated: null,
    parameters: {
      lowStockAlert: true,
      turnoverAnalysis: true,
      categoryBreakdown: true
    },
    isScheduled: true,
    scheduleFrequency: 'weekly'
  },
  {
    id: '4',
    name: 'Finansal Performans Raporu',
    type: 'financial',
    description: 'Gelir, gider ve kârlılık analiziyle finansal özet',
    category: 'strategic',
    createdBy: 'finance_manager',
    createdByName: 'Finans Müdürü',
    createdAt: new Date('2024-01-05').toISOString(),
    lastGenerated: new Date('2024-02-15').toISOString(),
    parameters: {
      profitAnalysis: true,
      cashFlow: true,
      budgetComparison: true
    },
    isScheduled: true,
    scheduleFrequency: 'monthly'
  },
  {
    id: '5',
    name: 'Performans İzleme Raporu',
    type: 'performance',
    description: 'KPI\'lar ve performans metriklerinin takibi',
    category: 'strategic',
    createdBy: 'admin',
    createdByName: 'Admin User',
    createdAt: new Date('2024-01-12').toISOString(),
    lastGenerated: new Date('2024-02-10').toISOString(),
    parameters: {
      kpiTracking: true,
      goalComparison: true,
      departmentBreakdown: true
    },
    isScheduled: false,
    scheduleFrequency: null
  }
]

// GET /api/reports - Raporları listele
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { 
    search = '', 
    type = 'all', 
    category = 'all', 
    page = '1', 
    limit = '10' 
  } = req.query

  let filteredReports = [...mockReports]

  // Arama filtresi
  if (search) {
    const searchTerm = (search as string).toLowerCase()
    filteredReports = filteredReports.filter(report =>
      report.name.toLowerCase().includes(searchTerm) ||
      report.description.toLowerCase().includes(searchTerm)
    )
  }

  // Tür filtresi
  if (type !== 'all') {
    filteredReports = filteredReports.filter(report => report.type === type)
  }

  // Kategori filtresi
  if (category !== 'all') {
    filteredReports = filteredReports.filter(report => report.category === category)
  }

  // Pagination
  const pageNum = parseInt(page as string)
  const limitNum = parseInt(limit as string)
  const startIndex = (pageNum - 1) * limitNum
  const endIndex = startIndex + limitNum
  const paginatedReports = filteredReports.slice(startIndex, endIndex)

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Raporlar başarıyla getirildi',
    data: {
      reports: paginatedReports,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredReports.length / limitNum),
        totalItems: filteredReports.length,
        itemsPerPage: limitNum
      }
    }
  })
}))

// POST /api/reports - Yeni rapor oluştur
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { name, type, description, category, parameters = {} } = req.body

  if (!name || !type) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Rapor adı ve türü zorunludur'
    })
  }

  const newReport = {
    id: Date.now().toString(),
    name,
    type,
    description: description || '',
    category: category || 'operational',
    createdBy: req.user?.id || 'unknown',
    createdByName: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Bilinmeyen Kullanıcı',
    createdAt: new Date().toISOString(),
    lastGenerated: null,
    parameters,
    isScheduled: false,
    scheduleFrequency: null
  }

  mockReports.unshift(newReport)

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Rapor başarıyla oluşturuldu',
    data: {
      report: newReport
    }
  })
}))

// POST /api/reports/generate/:id - Rapor oluştur
router.post('/generate/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const report = mockReports.find(r => r.id === id)

  if (!report) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Rapor bulunamadı'
    })
  }

  // Rapor türüne göre mock veri oluştur
  let generatedData: any = {}

  switch (report.type) {
    case 'sales':
      generatedData = {
        type: 'sales',
        period: 'Şubat 2024',
        totalRevenue: 1250000,
        totalOrders: 156,
        averageOrderValue: 8012.82,
        growth: 12.5,
        topProducts: [
          { name: 'Tıbbi Maske', quantity: 2500, revenue: 125000 },
          { name: 'Steril Eldiven', quantity: 1800, revenue: 108000 },
          { name: 'Antiseptik', quantity: 1200, revenue: 96000 }
        ],
        salesByCategory: [
          { category: 'Tıbbi Malzemeler', revenue: 650000 },
          { category: 'Laboratuvar', revenue: 400000 },
          { category: 'Diğer', revenue: 200000 }
        ]
      }
      break
    case 'customer':
      generatedData = {
        type: 'customer',
        totalCustomers: 245,
        newCustomers: 18,
        activeCustomers: 189,
        churnRate: 3.2,
        retentionRate: 87.8,
        topCustomers: [
          { name: 'Ankara Devlet Hastanesi', revenue: 85000, orders: 12 },
          { name: 'İzmir Özel Klinik', revenue: 72000, orders: 8 },
          { name: 'Bursa Tıp Merkezi', revenue: 68000, orders: 10 }
        ],
        customersByRegion: [
          { region: 'Marmara', customers: 89, percentage: 36.3 },
          { region: 'Akdeniz', customers: 67, percentage: 27.3 },
          { region: 'İç Anadolu', customers: 56, percentage: 22.9 }
        ]
      }
      break
    case 'inventory':
      generatedData = {
        type: 'inventory',
        totalProducts: 456,
        totalValue: 2850000,
        lowStockItems: 23,
        outOfStockItems: 5,
        turnoverRate: 4.2,
        topSellingProducts: [
          { name: 'Cerrahi Maske', stock: 15000, value: 450000 },
          { name: 'Latex Eldiven', stock: 8500, value: 255000 },
          { name: 'Dezenfektan', stock: 5200, value: 182000 }
        ],
        lowStockAlerts: [
          { name: 'Steril Gazlı Bez', currentStock: 150, minStock: 500 },
          { name: 'İğne Ucu', currentStock: 75, minStock: 200 },
          { name: 'Serum Seti', currentStock: 25, minStock: 100 }
        ]
      }
      break
    case 'financial':
      generatedData = {
        type: 'financial',
        totalRevenue: 1850000,
        totalExpenses: 1420000,
        grossProfit: 430000,
        netProfit: 385000,
        profitMargin: 20.8,
        monthlyData: [
          { month: 'Ocak', revenue: 920000, expenses: 710000, profit: 210000 },
          { month: 'Şubat', revenue: 930000, expenses: 710000, profit: 220000 }
        ],
        expenseBreakdown: [
          { category: 'Personel', amount: 650000, percentage: 45.8 },
          { category: 'Operasyonel', amount: 480000, percentage: 33.8 },
          { category: 'Pazarlama', amount: 290000, percentage: 20.4 }
        ]
      }
      break
    case 'performance':
      generatedData = {
        type: 'performance',
        kpis: [
          { name: 'Müşteri Memnuniyeti', value: 92, target: 90, status: 'success' },
          { name: 'Sipariş Teslim Süresi', value: 2.3, target: 3, status: 'success' },
          { name: 'Stok Devir Hızı', value: 4.2, target: 4.5, status: 'warning' },
          { name: 'Satış Hedefi', value: 87, target: 100, status: 'danger' }
        ],
        departmentPerformance: [
          { department: 'Satış', score: 89, trend: 'up' },
          { department: 'Lojistik', score: 94, trend: 'up' },
          { department: 'Finans', score: 86, trend: 'stable' }
        ]
      }
      break
  }

  // LastGenerated tarihini güncelle
  report.lastGenerated = new Date().toISOString()

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Rapor başarıyla oluşturuldu',
    data: generatedData
  })
}))

// GET /api/reports/export/:id - Rapor export
router.get('/export/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { format = 'json' } = req.query

  const report = mockReports.find(r => r.id === id)

  if (!report) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Rapor bulunamadı'
    })
  }

  if (format === 'csv') {
    // CSV formatında export
    const csvData = `Rapor Adı,Tür,Kategori,Oluşturan,Oluşturulma Tarihi
${report.name},${report.type},${report.category},${report.createdByName},${report.createdAt}`

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=report-${id}.csv`)
    return res.send(csvData)
  }

  // JSON formatında export
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Rapor başarıyla export edildi',
    data: {
      report,
      exportedAt: new Date().toISOString(),
      format: 'json'
    }
  })
}))

// GET /api/reports/:id/export/pdf - PDF export
router.get('/:id/export/pdf', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const report = mockReports.find(r => r.id === id)

  if (!report) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Rapor bulunamadı'
    })
  }

  try {
    // Mock PDF content generation
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(${report.name}) Tj
0 -20 Td
(Tür: ${report.type}) Tj
0 -20 Td
(Kategori: ${report.category}) Tj
0 -20 Td
(Oluşturan: ${report.createdByName}) Tj
0 -20 Td
(Tarih: ${report.createdAt}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000125 00000 n
0000000348 00000 n
0000000565 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
636
%%EOF`

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=rapor-${id}-${new Date().toISOString().split('T')[0]}.pdf`)
    res.setHeader('Content-Length', Buffer.byteLength(pdfContent))

    // Send PDF content
    res.send(pdfContent)

  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'PDF oluşturulurken hata oluştu'
    })
  }
}))

// GET /api/reports/dashboard - Dashboard verileri
router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const dashboardData = {
    totalRevenue: 2850000,
    totalCustomers: 245,
    totalOrders: 1567,
    totalProducts: 456,
    revenueGrowth: 12.5,
    customerGrowth: 8.3,
    orderGrowth: 15.2,
    productGrowth: 4.7,
    salesByMonth: [
      { month: 'Ocak', sales: 920000, orders: 156 },
      { month: 'Şubat', sales: 1050000, orders: 178 },
      { month: 'Mart', sales: 880000, orders: 142 }
    ],
    topProducts: [
      { name: 'Tıbbi Maske', sales: 450000, quantity: 15000 },
      { name: 'Latex Eldiven', sales: 320000, quantity: 8500 },
      { name: 'Antiseptik', sales: 280000, quantity: 5200 }
    ],
    topCustomers: [
      { name: 'Ankara Devlet Hastanesi', revenue: 285000, orders: 32 },
      { name: 'İzmir Özel Klinik', revenue: 220000, orders: 28 },
      { name: 'Bursa Tıp Merkezi', revenue: 195000, orders: 24 }
    ],
    salesByCategory: [
      { category: 'Tıbbi Malzemeler', value: 1200000, revenue: 1200000 },
      { category: 'Laboratuvar Ekipmanları', value: 850000, revenue: 850000 },
      { category: 'Koruyucu Malzemeler', value: 650000, revenue: 650000 },
      { category: 'Diğer', value: 150000, revenue: 150000 }
    ],
    revenueByRegion: [
      { region: 'Marmara', revenue: 1140000, percentage: 40.0 },
      { region: 'Akdeniz', revenue: 855000, percentage: 30.0 },
      { region: 'İç Anadolu', revenue: 570000, percentage: 20.0 },
      { region: 'Diğer', revenue: 285000, percentage: 10.0 }
    ]
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Dashboard verileri başarıyla getirildi',
    data: dashboardData
  })
}))

// GET /api/reports/analytics/sales - Satış analitiği
router.get('/analytics/sales', asyncHandler(async (req: Request, res: Response) => {
  const { period = 'monthly' } = req.query

  const salesAnalytics = {
    period: period as string,
    totalRevenue: 2850000,
    totalOrders: 1567,
    averageOrderValue: 1818.57,
    revenueGrowth: 12.5,
    orderGrowth: 15.2,
    conversionRate: 23.8,
    salesByPeriod: [
      { period: 'Ocak 2024', revenue: 920000, orders: 156 },
      { period: 'Şubat 2024', revenue: 1050000, orders: 178 },
      { period: 'Mart 2024', revenue: 880000, orders: 142 }
    ],
    topProducts: [
      { name: 'Tıbbi Maske', revenue: 450000, quantity: 15000, growth: 18.5 },
      { name: 'Latex Eldiven', revenue: 320000, quantity: 8500, growth: 22.3 },
      { name: 'Antiseptik', revenue: 280000, quantity: 5200, growth: -5.2 }
    ],
    salesByCategory: [
      { category: 'Tıbbi Malzemeler', revenue: 1200000, percentage: 42.1, growth: 15.3 },
      { category: 'Laboratuvar', revenue: 850000, percentage: 29.8, growth: 8.7 },
      { category: 'Koruyucu', revenue: 650000, percentage: 22.8, growth: 25.1 },
      { category: 'Diğer', revenue: 150000, percentage: 5.3, growth: -2.1 }
    ],
    revenueByRegion: [
      { region: 'Marmara', revenue: 1140000, percentage: 40.0, growth: 12.8 },
      { region: 'Akdeniz', revenue: 855000, percentage: 30.0, growth: 18.5 },
      { region: 'İç Anadolu', revenue: 570000, percentage: 20.0, growth: 5.2 },
      { region: 'Diğer', revenue: 285000, percentage: 10.0, growth: 8.9 }
    ],
    salesTrend: [
      { date: '2024-01-01', value: 30000 },
      { date: '2024-01-15', value: 45000 },
      { date: '2024-02-01', value: 38000 },
      { date: '2024-02-15', value: 52000 },
      { date: '2024-03-01', value: 41000 },
      { date: '2024-03-15', value: 39000 }
    ]
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Satış analitiği başarıyla getirildi',
    data: salesAnalytics
  })
}))

// GET /api/reports/analytics/customers - Müşteri analitiği
router.get('/analytics/customers', asyncHandler(async (req: Request, res: Response) => {
  const customerAnalytics = {
    totalCustomers: 245,
    newCustomers: 18,
    activeCustomers: 189,
    churningCustomers: 8,
    customerGrowth: 8.3,
    retentionRate: 87.8,
    averageCustomerValue: 11632.65,
    customerLifetimeValue: 58163.27,
    topCustomers: [
      { name: 'Ankara Devlet Hastanesi', revenue: 285000, orders: 32, ltv: 95000 },
      { name: 'İzmir Özel Klinik', revenue: 220000, orders: 28, ltv: 78000 },
      { name: 'Bursa Tıp Merkezi', revenue: 195000, orders: 24, ltv: 65000 }
    ],
    customersByRegion: [
      { region: 'Marmara', customers: 89, percentage: 36.3, growth: 12.5 },
      { region: 'Akdeniz', customers: 67, percentage: 27.3, growth: 8.9 },
      { region: 'İç Anadolu', customers: 56, percentage: 22.9, growth: 5.2 },
      { region: 'Diğer', customers: 33, percentage: 13.5, growth: 15.8 }
    ],
    customerSegments: [
      { segment: 'Büyük Hastaneler', count: 45, revenue: 1425000, percentage: 18.4 },
      { segment: 'Özel Klinikler', count: 89, revenue: 980000, percentage: 36.3 },
      { segment: 'Eczaneler', count: 78, revenue: 350000, percentage: 31.8 },
      { segment: 'Diğer', count: 33, revenue: 95000, percentage: 13.5 }
    ],
    acquisitionChannels: [
      { channel: 'Referans', customers: 98, percentage: 40.0, cost: 150 },
      { channel: 'Dijital Pazarlama', customers: 73, percentage: 29.8, cost: 280 },
      { channel: 'Fuarlar', customers: 49, percentage: 20.0, cost: 450 },
      { channel: 'Diğer', customers: 25, percentage: 10.2, cost: 200 }
    ]
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Müşteri analitiği başarıyla getirildi',
    data: customerAnalytics
  })
}))

// GET /api/reports/analytics/inventory - Envanter analitiği  
router.get('/analytics/inventory', asyncHandler(async (req: Request, res: Response) => {
  const inventoryAnalytics = {
    totalProducts: 456,
    totalValue: 2850000,
    lowStockItems: 23,
    outOfStockItems: 5,
    fastMovingItems: 89,
    slowMovingItems: 34,
    inventoryTurnover: 4.2,
    topSellingProducts: [
      { name: 'Tıbbi Maske', stock: 15000, value: 450000, turnover: 8.5, status: 'fast' },
      { name: 'Latex Eldiven', stock: 8500, value: 255000, turnover: 6.2, status: 'fast' },
      { name: 'Antiseptik', stock: 5200, value: 182000, turnover: 4.1, status: 'normal' },
      { name: 'Steril Gazlı Bez', stock: 3100, value: 124000, turnover: 3.8, status: 'normal' },
      { name: 'Serum Seti', stock: 2850, value: 171000, turnover: 2.1, status: 'slow' }
    ],
    categoryBreakdown: [
      { category: 'Tıbbi Malzemeler', products: 156, value: 1200000, percentage: 42.1 },
      { category: 'Laboratuvar Ekipmanları', products: 89, value: 850000, percentage: 29.8 },
      { category: 'Koruyucu Malzemeler', products: 134, value: 650000, percentage: 22.8 },
      { category: 'Diğer', products: 77, value: 150000, percentage: 5.3 }
    ],
    stockLevels: [
      { level: 'Yüksek Stok', count: 178, percentage: 39.0 },
      { level: 'Normal Stok', count: 250, percentage: 54.8 },
      { level: 'Düşük Stok', count: 23, percentage: 5.0 },
      { level: 'Stok Yok', count: 5, percentage: 1.1 }
    ],
    movementAnalysis: [
      { period: 'Son 7 Gün', inbound: 89, outbound: 156, net: -67 },
      { period: 'Son 30 Gün', inbound: 345, outbound: 678, net: -333 },
      { period: 'Son 90 Gün', inbound: 1234, outbound: 2156, net: -922 }
    ]
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Envanter analitiği başarıyla getirildi',
    data: inventoryAnalytics
  })
}))

// GET /api/reports/analytics/financial - Finansal analitik
router.get('/analytics/financial', asyncHandler(async (req: Request, res: Response) => {
  const financialAnalytics = {
    totalRevenue: 2850000,
    totalCosts: 2280000,
    grossProfit: 570000,
    netProfit: 485000,
    profitMargin: 17.0,
    grossMargin: 20.0,
    operatingExpenses: 85000,
    revenueGrowth: 12.5,
    profitGrowth: 18.3,
    monthlyFinancials: [
      { 
        month: 'Ocak 2024', 
        revenue: 920000, 
        costs: 736000, 
        profit: 184000, 
        margin: 20.0 
      },
      { 
        month: 'Şubat 2024', 
        revenue: 1050000, 
        costs: 819000, 
        profit: 231000, 
        margin: 22.0 
      },
      { 
        month: 'Mart 2024', 
        revenue: 880000, 
        costs: 725000, 
        profit: 155000, 
        margin: 17.6 
      }
    ],
    expenseBreakdown: [
      { category: 'Malzeme Maliyeti', amount: 1710000, percentage: 75.0 },
      { category: 'Personel Giderleri', amount: 342000, percentage: 15.0 },
      { category: 'Operasyonel Giderler', amount: 114000, percentage: 5.0 },
      { category: 'Pazarlama', amount: 68400, percentage: 3.0 },
      { category: 'Diğer', amount: 45600, percentage: 2.0 }
    ],
    cashFlow: {
      operatingCashFlow: 520000,
      investingCashFlow: -85000,
      financingCashFlow: -125000,
      netCashFlow: 310000,
      cashBalance: 1250000
    }
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Finansal analitik başarıyla getirildi',
    data: financialAnalytics
  })
}))

export default router