import { Router } from 'express'
import { Request, Response } from 'express'
import { asyncHandler, CustomError, HTTP_STATUS } from '../middleware/errorMiddleware'
import { authenticateToken } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/roleMiddleware'
import {
  mockCustomers,
  addCustomer,
  updateCustomer,
  getCustomerById,
  Customer
} from '../data/mockData'
import { crmEvents } from '../services/eventService'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

/**
 * @route   GET /api/customers
 * @desc    Get all customers
 * @access  Private
 */
router.get('/', requirePermission('customers', 'read'), asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = '',
    segment = '',
    city = ''
  } = req.query

  let filteredCustomers = [...mockCustomers]

  // Filter by search (company name or contact person)
  if (search) {
    const searchLower = (search as string).toLowerCase()
    filteredCustomers = filteredCustomers.filter(customer =>
      customer.companyName.toLowerCase().includes(searchLower) ||
      customer.contactPerson.toLowerCase().includes(searchLower)
    )
  }

  // Filter by status
  if (status && status !== 'all') {
    filteredCustomers = filteredCustomers.filter(customer => customer.status === status)
  }

  // Filter by segment
  if (segment && segment !== 'all') {
    filteredCustomers = filteredCustomers.filter(customer => customer.segment === segment)
  }

  // Filter by city
  if (city && city !== 'all') {
    filteredCustomers = filteredCustomers.filter(customer => customer.city === city)
  }

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit)
  const endIndex = startIndex + Number(limit)
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      customers: paginatedCustomers,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(filteredCustomers.length / Number(limit)),
        totalItems: filteredCustomers.length,
        itemsPerPage: Number(limit)
      }
    }
  })
}))

/**
 * @route   GET /api/customers/:id
 * @desc    Get customer by ID
 * @access  Private
 */
router.get('/:id', requirePermission('customers', 'read'), asyncHandler(async (req: Request, res: Response) => {
  const customer = getCustomerById(req.params.id)
  
  if (!customer) {
    throw new CustomError('Müşteri bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { customer }
  })
}))

/**
 * @route   POST /api/customers
 * @desc    Create new customer
 * @access  Private
 */
router.post('/', requirePermission('customers', 'create'), asyncHandler(async (req: Request, res: Response) => {
  const {
    companyName,
    contactPerson,
    email,
    phone,
    address,
    city,
    country,
    customerType,
    segment,
    taxNumber,
    paymentTerms,
    creditLimit,
    notes
  } = req.body

  // Basic validation
  if (!companyName || !contactPerson || !email || !phone) {
    throw new CustomError('Şirket adı, iletişim kişisi, e-posta ve telefon alanları zorunludur', HTTP_STATUS.BAD_REQUEST)
  }

  // Check if email already exists
  const existingCustomer = mockCustomers.find(c => c.email === email)
  if (existingCustomer) {
    throw new CustomError('Bu e-posta adresi zaten kullanılıyor', HTTP_STATUS.BAD_REQUEST)
  }

  const newCustomer = addCustomer({
    companyName,
    contactPerson,
    email,
    phone,
    address: address || '',
    city: city || '',
    country: country || 'Türkiye',
    customerType: customerType || 'corporate',
    segment: segment || 'pharmaceutical',
    taxNumber: taxNumber || '',
    status: 'active',
    paymentTerms: paymentTerms || 30,
    // Credit Management Fields
    creditLimit: creditLimit || 50000.00,
    availableCredit: creditLimit || 50000.00,
    totalOutstanding: 0.00,
    lastPaymentDate: null,
    creditStatus: 'good',
    totalSales: 0,
    lastOrderDate: '',
    registrationDate: new Date().toISOString(),
    assignedSalesRep: req.user?.firstName + ' ' + req.user?.lastName || '',
    notes: notes || '',
    communicationHistory: [],
    feedback: []
  })

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Müşteri başarıyla oluşturuldu',
    data: { customer: newCustomer }
  })
}))

/**
 * @route   PUT /api/customers/:id
 * @desc    Update customer
 * @access  Private
 */
router.put('/:id', requirePermission('customers', 'update'), asyncHandler(async (req: Request, res: Response) => {
  const existingCustomer = getCustomerById(req.params.id)
  
  if (!existingCustomer) {
    throw new CustomError('Müşteri bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const {
    companyName,
    contactPerson,
    email,
    phone,
    address,
    city,
    country,
    customerType,
    segment,
    taxNumber,
    status,
    paymentTerms,
    creditLimit,
    notes
  } = req.body

  // Check if email is being changed and if it already exists
  if (email && email !== existingCustomer.email) {
    const duplicateCustomer = mockCustomers.find(c => c.email === email && c.id !== req.params.id)
    if (duplicateCustomer) {
      throw new CustomError('Bu e-posta adresi zaten kullanılıyor', HTTP_STATUS.BAD_REQUEST)
    }
  }

  // Update customer
  const updates: Partial<Customer> = {
    companyName: companyName || existingCustomer.companyName,
    contactPerson: contactPerson || existingCustomer.contactPerson,
    email: email || existingCustomer.email,
    phone: phone || existingCustomer.phone,
    address: address !== undefined ? address : existingCustomer.address,
    city: city !== undefined ? city : existingCustomer.city,
    country: country !== undefined ? country : existingCustomer.country,
    customerType: customerType || existingCustomer.customerType,
    segment: segment || existingCustomer.segment,
    taxNumber: taxNumber !== undefined ? taxNumber : existingCustomer.taxNumber,
    status: status || existingCustomer.status,
    paymentTerms: paymentTerms !== undefined ? paymentTerms : existingCustomer.paymentTerms,
    creditLimit: creditLimit !== undefined ? creditLimit : existingCustomer.creditLimit,
    notes: notes !== undefined ? notes : existingCustomer.notes,
    // If credit limit is being updated, recalculate available credit
    availableCredit: creditLimit !== undefined ?
      creditLimit - existingCustomer.totalOutstanding :
      existingCustomer.availableCredit
  }
  
  const updatedCustomer = updateCustomer(req.params.id, updates)
  
  // Emit event if credit limit was updated
  if (creditLimit !== undefined && creditLimit !== existingCustomer.creditLimit) {
    crmEvents.emitCustomerCreditUpdate({
      customerId: req.params.id,
      oldCreditLimit: existingCustomer.creditLimit,
      newCreditLimit: creditLimit,
      oldAvailableCredit: existingCustomer.availableCredit,
      newAvailableCredit: updatedCustomer.availableCredit,
      updatedBy: req.user?.firstName + ' ' + req.user?.lastName || '',
      timestamp: new Date().toISOString(),
      reason: 'Müşteri bilgileri güncellendi'
    })
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Müşteri başarıyla güncellendi',
    data: { customer: updatedCustomer }
  })
}))

/**
 * @route   DELETE /api/customers/:id
 * @desc    Delete customer
 * @access  Private
 */
router.delete('/:id', requirePermission('customers', 'delete'), asyncHandler(async (req: Request, res: Response) => {
  const customer = getCustomerById(req.params.id)
  
  if (!customer) {
    throw new CustomError('Müşteri bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  // Instead of deleting, mark as inactive (soft delete)
  updateCustomer(req.params.id, { status: 'inactive' })

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Müşteri başarıyla silindi'
  })
}))

/**
 * @route   POST /api/customers/:id/communication
 * @desc    Add communication record
 * @access  Private
 */
router.post('/:id/communication', requirePermission('customers', 'update'), asyncHandler(async (req: Request, res: Response) => {
  const customer = getCustomerById(req.params.id)
  
  if (!customer) {
    throw new CustomError('Müşteri bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const { type, subject, description } = req.body

  if (!type || !subject) {
    throw new CustomError('İletişim tipi ve konu alanları zorunludur', HTTP_STATUS.BAD_REQUEST)
  }

  const communicationRecord = {
    id: String(Date.now()),
    type,
    subject,
    description: description || '',
    date: new Date().toISOString()
  }

  customer.communicationHistory.push(communicationRecord)

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'İletişim kaydı başarıyla eklendi',
    data: { communication: communicationRecord }
  })
}))

/**
 * @route   POST /api/customers/:id/feedback
 * @desc    Add customer feedback
 * @access  Private
 */
router.post('/:id/feedback', requirePermission('customers', 'update'), asyncHandler(async (req: Request, res: Response) => {
  const customer = getCustomerById(req.params.id)
  
  if (!customer) {
    throw new CustomError('Müşteri bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const { type, rating, comment } = req.body

  if (!type || !rating) {
    throw new CustomError('Geri bildirim tipi ve puan alanları zorunludur', HTTP_STATUS.BAD_REQUEST)
  }

  if (rating < 1 || rating > 5) {
    throw new CustomError('Puan 1-5 arasında olmalıdır', HTTP_STATUS.BAD_REQUEST)
  }

  const feedbackRecord = {
    id: String(Date.now()),
    type,
    rating: Number(rating),
    comment: comment || '',
    date: new Date().toISOString()
  }

  customer.feedback.push(feedbackRecord)

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Geri bildirim başarıyla eklendi',
    data: { feedback: feedbackRecord }
  })
}))

/**
 * @route   GET /api/customers/:id/credit-status
 * @desc    Get customer credit status and details
 * @access  Private
 */
router.get('/:id/credit-status', requirePermission('customers', 'read'), asyncHandler(async (req: Request, res: Response) => {
  const customer = getCustomerById(req.params.id)
  
  if (!customer) {
    throw new CustomError('Müşteri bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const creditInfo = {
    customerId: customer.id,
    companyName: customer.companyName,
    creditLimit: customer.creditLimit,
    availableCredit: customer.availableCredit,
    totalOutstanding: customer.totalOutstanding,
    creditUtilization: ((customer.totalOutstanding / customer.creditLimit) * 100).toFixed(2),
    creditStatus: customer.creditStatus,
    paymentTerms: customer.paymentTerms,
    lastPaymentDate: customer.lastPaymentDate,
    recommendations: [] as string[]
  }

  // Add recommendations based on credit status
  if (customer.creditStatus === 'warning') {
    creditInfo.recommendations.push('Kredi limitine yaklaştı, ödeme takibi yapılmalı')
  }
  if (customer.creditStatus === 'exceeded') {
    creditInfo.recommendations.push('Kredi limiti aşıldı, yeni satış yapmadan önce ödeme alınmalı')
    creditInfo.recommendations.push('Müşteri ile ödeme planı görüşülmeli')
  }
  if (!customer.lastPaymentDate) {
    creditInfo.recommendations.push('Henüz ödeme yapılmamış, ödeme takibi başlatılmalı')
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { creditInfo }
  })
}))

/**
 * @route   PUT /api/customers/:id/credit-limit
 * @desc    Update customer credit limit
 * @access  Private
 */
router.put('/:id/credit-limit', requirePermission('customers', 'update'), asyncHandler(async (req: Request, res: Response) => {
  const customer = getCustomerById(req.params.id)
  
  if (!customer) {
    throw new CustomError('Müşteri bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const { creditLimit, reason } = req.body

  if (!creditLimit || creditLimit < 0) {
    throw new CustomError('Geçerli bir kredi limiti giriniz', HTTP_STATUS.BAD_REQUEST)
  }

  const oldCreditLimit = customer.creditLimit
  const totalOutstanding = customer.totalOutstanding

  // Update credit limit and recalculate available credit
  const updates: Partial<Customer> = {
    creditLimit,
    availableCredit: creditLimit - totalOutstanding
  }

  // Update credit status based on new limit
  const utilizationRate = totalOutstanding / creditLimit
  if (utilizationRate > 1) {
    updates.creditStatus = 'exceeded'
  } else if (utilizationRate > 0.9) {
    updates.creditStatus = 'warning'
  } else {
    updates.creditStatus = 'good'
  }

  const updatedCustomer = updateCustomer(req.params.id, updates)
  
  // Emit credit update event
  crmEvents.emitCustomerCreditUpdate({
    customerId: req.params.id,
    oldCreditLimit,
    newCreditLimit: creditLimit,
    oldAvailableCredit: customer.availableCredit,
    newAvailableCredit: updatedCustomer.availableCredit,
    updatedBy: req.user?.firstName + ' ' + req.user?.lastName || '',
    timestamp: new Date().toISOString(),
    reason: reason || 'Kredi limiti güncellendi'
  })
  
  // Log the change (in real app this would go to audit log)
  const changeLog = {
    customerId: req.params.id,
    oldCreditLimit,
    newCreditLimit: creditLimit,
    changedBy: req.user?.firstName + ' ' + req.user?.lastName || '',
    changeDate: new Date().toISOString(),
    reason: reason || 'Kredi limiti güncellendi'
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Kredi limiti başarıyla güncellendi',
    data: {
      customer: updatedCustomer,
      changeLog
    }
  })
}))

/**
 * @route   POST /api/customers/:id/credit-check
 * @desc    Check if customer can make a purchase with given amount
 * @access  Private
 */
router.post('/:id/credit-check', requirePermission('customers', 'read'), asyncHandler(async (req: Request, res: Response) => {
  const customer = getCustomerById(req.params.id)
  
  if (!customer) {
    throw new CustomError('Müşteri bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const { amount } = req.body

  if (!amount || amount <= 0) {
    throw new CustomError('Geçerli bir tutar giriniz', HTTP_STATUS.BAD_REQUEST)
  }

  const canPurchase = customer.availableCredit >= amount
  const availableAfterPurchase = customer.availableCredit - amount

  const creditCheck = {
    customerId: customer.id,
    companyName: customer.companyName,
    requestedAmount: amount,
    currentAvailableCredit: customer.availableCredit,
    canPurchase,
    availableAfterPurchase: canPurchase ? availableAfterPurchase : null,
    creditStatus: customer.creditStatus,
    warnings: [] as string[]
  }

  // Add warnings
  if (!canPurchase) {
    creditCheck.warnings.push('Yetersiz kredi limiti - satış gerçekleştirilemez')
    creditCheck.warnings.push(`Eksik tutar: ${(amount - customer.availableCredit).toFixed(2)} TL`)
  } else if (availableAfterPurchase < (customer.creditLimit * 0.1)) {
    creditCheck.warnings.push('Bu satış sonrası kredi limiti kritik seviyeye düşecek')
  }

  if (customer.creditStatus === 'warning') {
    creditCheck.warnings.push('Müşterinin mevcut kredi durumu uyarı seviyesinde')
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { creditCheck }
  })
}))

/**
 * @route   GET /api/customers/credit-summary
 * @desc    Get credit summary for all customers
 * @access  Private
 */
router.get('/credit-summary', requirePermission('customers', 'read'), asyncHandler(async (req: Request, res: Response) => {
  const creditSummary = {
    totalCustomers: mockCustomers.length,
    activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
    creditStatusBreakdown: {
      good: mockCustomers.filter(c => c.creditStatus === 'good').length,
      warning: mockCustomers.filter(c => c.creditStatus === 'warning').length,
      exceeded: mockCustomers.filter(c => c.creditStatus === 'exceeded').length,
      blocked: mockCustomers.filter(c => c.creditStatus === 'blocked').length
    },
    totalCreditLimit: mockCustomers.reduce((sum, c) => sum + c.creditLimit, 0),
    totalOutstanding: mockCustomers.reduce((sum, c) => sum + c.totalOutstanding, 0),
    totalAvailableCredit: mockCustomers.reduce((sum, c) => sum + c.availableCredit, 0),
    riskCustomers: mockCustomers.filter(c => c.creditStatus === 'warning' || c.creditStatus === 'exceeded').map(c => ({
      id: c.id,
      companyName: c.companyName,
      creditLimit: c.creditLimit,
      totalOutstanding: c.totalOutstanding,
      creditStatus: c.creditStatus,
      utilizationRate: ((c.totalOutstanding / c.creditLimit) * 100).toFixed(2)
    }))
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { creditSummary }
  })
}))

export default router