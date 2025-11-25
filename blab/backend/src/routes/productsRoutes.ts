import { Router } from 'express'
import { Request, Response } from 'express'
import { asyncHandler, CustomError, HTTP_STATUS } from '../middleware/errorMiddleware'
import { authenticateToken } from '../middleware/authMiddleware'
import { requirePermission } from '../middleware/roleMiddleware'
import { 
  mockProducts, 
  getProductById, 
  updateProductStock,
  decreaseProductStock,
  checkStockAvailability,
  Product 
} from '../data/mockData'
import { crmEvents } from '../services/eventService'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// Convert mockProducts to old format for compatibility
const convertToOldFormat = (product: any) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  category: product.category,
  subcategory: product.subcategory,
  sku: product.sku,
  barcode: product.barcode,
  manufacturer: product.manufacturer,
  supplier: product.supplier,
  unitPrice: product.price,
  currency: product.currency,
  costPrice: product.cost,
  profitMargin: ((product.price - product.cost) / product.price) * 100,
  stockQuantity: product.stock.current,
  minStockLevel: product.stock.minimum,
  maxStockLevel: product.stock.maximum,
  reorderPoint: product.stock.minimum,
  unit: product.unit,
  packSize: product.packageSize,
  expiryDate: product.shelfLife > 0 ? new Date(Date.now() + product.shelfLife * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
  batchNumber: `${product.sku}-${new Date().getFullYear()}001`,
  storageConditions: product.storageConditions,
  prescriptionRequired: product.requiresPrescription,
  activeIngredient: product.category === 'pharmaceuticals' ? product.name.split(' ')[0] : null,
  dosageForm: product.category === 'pharmaceuticals' ? 'tablet' : product.category === 'medical_devices' ? 'cihaz' : 'diğer',
  strength: product.category === 'pharmaceuticals' ? '500mg' : null,
  status: product.isActive ? 'active' : 'inactive',
  tags: product.tags,
  importInfo: {
    isImported: product.manufacturerCountry !== 'Türkiye',
    originCountry: product.manufacturerCountry,
    importDate: product.manufacturerCountry !== 'Türkiye' ? product.createdAt : null,
    customsCode: product.category === 'pharmaceuticals' ? '3004.10.10.00' : '9025.19.20.00'
  },
  qualityControl: {
    lastInspectionDate: product.updatedAt,
    nextInspectionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    qualityStatus: 'approved',
    certificates: product.certifications
  },
  createdAt: product.createdAt,
  updatedAt: product.updatedAt
})

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Private
 */
router.get('/', requirePermission('products', 'read'), asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    category = '',
    status = '',
    lowStock = 'false',
    sortBy = 'name',
    sortOrder = 'asc'
  } = req.query

  // Convert central products to old format
  const convertedProducts = mockProducts.map(convertToOldFormat)
  
  // First filter out deleted/inactive products unless specifically requested
  let filteredProducts = convertedProducts.filter(product => product.status === 'active')

  // Filter by search (name, sku, or description)
  if (search) {
    const searchLower = (search as string).toLowerCase()
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    )
  }

  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === category)
  }

  // Filter by status
  if (status && status !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.status === status)
  }

  // Filter by low stock
  if (lowStock === 'true') {
    filteredProducts = filteredProducts.filter(product => 
      product.stockQuantity <= product.minStockLevel
    )
  }

  // Sorting
  filteredProducts.sort((a, b) => {
    let aValue = a[sortBy as keyof typeof a]
    let bValue = b[sortBy as keyof typeof b]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }
    
    if (sortOrder === 'desc') {
      return (aValue || 0) > (bValue || 0) ? -1 : (aValue || 0) < (bValue || 0) ? 1 : 0
    } else {
      return (aValue || 0) < (bValue || 0) ? -1 : (aValue || 0) > (bValue || 0) ? 1 : 0
    }
  })

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit)
  const endIndex = startIndex + Number(limit)
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(filteredProducts.length / Number(limit)),
        totalItems: filteredProducts.length,
        itemsPerPage: Number(limit)
      },
      summary: {
        totalProducts: convertedProducts.length,
        activeProducts: convertedProducts.filter(p => p.status === 'active').length,
        lowStockProducts: convertedProducts.filter(p => p.stockQuantity <= p.minStockLevel).length,
        totalStockValue: convertedProducts.reduce((total, p) => total + (p.stockQuantity * p.costPrice), 0)
      }
    }
  })
}))

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Private
 */
router.get('/:id', requirePermission('products', 'read'), asyncHandler(async (req: Request, res: Response) => {
  const centralProduct = getProductById(req.params.id)
  
  if (!centralProduct) {
    throw new CustomError('Ürün bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const product = convertToOldFormat(centralProduct)

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: { product }
  })
}))

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private
 */
router.post('/', requirePermission('products', 'create'), asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    category,
    subcategory,
    sku,
    barcode,
    manufacturer,
    supplier,
    unitPrice,
    costPrice,
    stockQuantity,
    minStockLevel,
    maxStockLevel,
    unit,
    packSize,
    expiryDate,
    batchNumber,
    storageConditions,
    prescriptionRequired,
    activeIngredient,
    dosageForm,
    strength,
    tags,
    importInfo,
    qualityControl
  } = req.body

  // Basic validation
  if (!name || !category || !sku || !unitPrice || !costPrice) {
    throw new CustomError('Ürün adı, kategori, SKU, satış fiyatı ve maliyet fiyatı alanları zorunludur', HTTP_STATUS.BAD_REQUEST)
  }

  // Check if SKU already exists
  const existingProduct = mockProducts.find(p => p.sku === sku)
  if (existingProduct) {
    throw new CustomError('Bu SKU zaten kullanılıyor', HTTP_STATUS.BAD_REQUEST)
  }

  const newProduct = {
    id: String(mockProducts.length + 1),
    name,
    sku,
    description: description || '',
    category,
    subcategory: subcategory || '',
    brand: manufacturer || '',
    manufacturer: manufacturer || '',
    manufacturerCountry: importInfo?.originCountry || 'Türkiye',
    barcode: barcode || '',
    price: Number(unitPrice),
    cost: Number(costPrice),
    currency: 'TRY',
    unit: unit || 'adet',
    packageSize: Number(packSize) || 1,
    minOrderQuantity: Number(minStockLevel) || 1,
    stock: {
      current: Number(stockQuantity) || 0,
      minimum: Number(minStockLevel) || 0,
      maximum: Number(maxStockLevel) || 1000,
      reserved: 0
    },
    supplier: supplier || '1',
    isActive: true,
    isMedical: category === 'pharmaceuticals' || category === 'medical_devices',
    requiresPrescription: Boolean(prescriptionRequired),
    shelfLife: expiryDate ? 36 : 0,
    storageConditions: storageConditions || 'Normal oda koşullarında saklanmalı',
    certifications: qualityControl?.certificates || ['CE'],
    tags: tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSoldAt: '',
    totalSold: 0,
    averageRating: 0,
    reviews: 0
  }

  mockProducts.push(newProduct as Product)

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Ürün başarıyla oluşturuldu',
    data: { product: convertToOldFormat(newProduct) }
  })
}))

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private
 */
router.put('/:id', requirePermission('products', 'update'), asyncHandler(async (req: Request, res: Response) => {
  const product = getProductById(req.params.id)
  
  if (!product) {
    throw new CustomError('Ürün bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const {
    name,
    description,
    category,
    subcategory,
    sku,
    barcode,
    manufacturer,
    supplier,
    unitPrice,
    costPrice,
    stockQuantity,
    minStockLevel,
    maxStockLevel,
    unit,
    packSize,
    expiryDate,
    batchNumber,
    storageConditions,
    prescriptionRequired,
    activeIngredient,
    dosageForm,
    strength,
    status,
    tags,
    importInfo,
    qualityControl
  } = req.body

  // Check if SKU is being changed and if it already exists
  if (sku && sku !== product.sku) {
    const existingProduct = mockProducts.find(p => p.sku === sku && p.id !== req.params.id)
    if (existingProduct) {
      throw new CustomError('Bu SKU zaten kullanılıyor', HTTP_STATUS.BAD_REQUEST)
    }
  }

  // Update product
  Object.assign(product, {
    name: name || product.name,
    description: description !== undefined ? description : product.description,
    category: category || product.category,
    subcategory: subcategory !== undefined ? subcategory : product.subcategory,
    sku: sku || product.sku,
    barcode: barcode !== undefined ? barcode : product.barcode,
    manufacturer: manufacturer !== undefined ? manufacturer : product.manufacturer,
    price: unitPrice !== undefined ? Number(unitPrice) : product.price,
    cost: costPrice !== undefined ? Number(costPrice) : product.cost,
    stock: {
      ...product.stock,
      current: stockQuantity !== undefined ? Number(stockQuantity) : product.stock.current,
      minimum: minStockLevel !== undefined ? Number(minStockLevel) : product.stock.minimum,
      maximum: maxStockLevel !== undefined ? Number(maxStockLevel) : product.stock.maximum
    },
    unit: unit !== undefined ? unit : product.unit,
    packageSize: packSize !== undefined ? Number(packSize) : product.packageSize,
    storageConditions: storageConditions !== undefined ? storageConditions : product.storageConditions,
    requiresPrescription: prescriptionRequired !== undefined ? Boolean(prescriptionRequired) : product.requiresPrescription,
    isActive: status !== undefined ? status === 'active' : product.isActive,
    tags: tags !== undefined ? tags : product.tags,
    updatedAt: new Date().toISOString()
  })

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Ürün başarıyla güncellendi',
    data: { product: convertToOldFormat(product) }
  })
}))

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private
 */
router.delete('/:id', requirePermission('products', 'delete'), asyncHandler(async (req: Request, res: Response) => {
  const productIndex = mockProducts.findIndex(p => p.id === req.params.id)
  
  if (productIndex === -1) {
    throw new CustomError('Ürün bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  // Physical delete - remove the product completely from array
  mockProducts.splice(productIndex, 1)

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Ürün başarıyla silindi'
  })
}))

/**
 * @route   POST /api/products/:id/stock/adjust
 * @desc    Adjust product stock
 * @access  Private
 */
router.post('/:id/stock/adjust', requirePermission('products', 'update'), asyncHandler(async (req: Request, res: Response) => {
  const product = getProductById(req.params.id)
  
  if (!product) {
    throw new CustomError('Ürün bulunamadı', HTTP_STATUS.NOT_FOUND)
  }

  const { adjustment, reason } = req.body

  if (!adjustment || !reason) {
    throw new CustomError('Stok düzeltmesi ve sebep alanları zorunludur', HTTP_STATUS.BAD_REQUEST)
  }

  const oldStock = product.stock.current
  const newStock = oldStock + Number(adjustment)
  
  if (newStock < 0) {
    throw new CustomError('Stok miktarı negatif olamaz', HTTP_STATUS.BAD_REQUEST)
  }

  const updatedProduct = updateProductStock(req.params.id, newStock)
  
  if (!updatedProduct) {
    throw new CustomError('Stok güncellemesi başarısız', HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }

  // Emit stock update event
  crmEvents.emitStockUpdate({
    productId: req.params.id,
    productName: product.name,
    productSku: product.sku,
    oldStock: oldStock,
    newStock: newStock,
    quantity: Math.abs(Number(adjustment)),
    reason: 'adjustment',
    updatedBy: req.user?.firstName + ' ' + req.user?.lastName || 'System',
    timestamp: new Date().toISOString()
  })

  const stockMovement = {
    id: String(Date.now()),
    productId: req.params.id,
    type: Number(adjustment) > 0 ? 'inbound' : 'outbound',
    quantity: Math.abs(Number(adjustment)),
    reason,
    previousStock: oldStock,
    newStock: newStock,
    performedBy: req.user?.firstName + ' ' + req.user?.lastName || 'System',
    createdAt: new Date().toISOString()
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Stok başarıyla güncellendi',
    data: { 
      product: convertToOldFormat(updatedProduct),
      stockMovement 
    }
  })
}))

export default router