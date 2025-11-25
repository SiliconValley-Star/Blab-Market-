// Shared mock data for all modules
export interface Customer {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  customerType: string
  segment: string
  taxNumber: string
  status: string
  paymentTerms: number
  // Credit Management Fields
  creditLimit: number
  availableCredit: number
  totalOutstanding: number
  lastPaymentDate: string | null
  creditStatus: 'good' | 'warning' | 'exceeded' | 'blocked'
  totalSales: number
  lastOrderDate: string
  registrationDate: string
  assignedSalesRep: string
  notes: string
  communicationHistory: Array<{
    id: string
    type: string
    subject: string
    date: string
    description: string
  }>
  feedback: Array<{
    id: string
    type: string
    rating: number
    comment: string
    date: string
  }>
}

export interface Product {
  id: string
  name: string
  sku: string
  description: string
  category: string
  subcategory: string
  brand: string
  manufacturer: string
  manufacturerCountry: string
  barcode: string
  price: number
  cost: number
  currency: string
  unit: string
  packageSize: number
  minOrderQuantity: number
  stock: {
    current: number
    minimum: number
    maximum: number
    reserved: number
  }
  supplier: string
  isActive: boolean
  isMedical: boolean
  requiresPrescription: boolean
  shelfLife: number
  storageConditions: string
  certifications: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
  lastSoldAt: string
  totalSold: number
  averageRating: number
  reviews: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customerName: string
  issueDate: string
  dueDate: string
  status: 'pending' | 'paid' | 'partial' | 'overdue'
  currency: string
  subtotal: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  items: Array<{
    id: string
    productId: string
    productName: string
    productSku: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    taxRate: number
  }>
  paymentTerms: {
    paymentDays: number
    discountDays: number
    discountRate: number
    paymentMethod: string
  }
  billingAddress: {
    company: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  notes: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  invoiceId: string
  invoiceNumber: string
  customerId: string
  customerName: string
  amount: number
  currency: string
  paymentDate: string
  paymentMethod: string
  reference: string
  status: string
  notes: string
  processedBy: string
  processedByName: string
  createdAt: string
}

// Shared mock customers data with enhanced credit management
export const mockCustomers: Customer[] = [
  {
    id: '1',
    companyName: 'ABC İlaç A.Ş.',
    contactPerson: 'Ahmet Yılmaz',
    email: 'ahmet@abcilac.com',
    phone: '+90 212 555 0101',
    address: 'Maslak Mah. Büyükdere Cad. No:123 Sarıyer/İstanbul',
    city: 'İstanbul',
    country: 'Türkiye',
    customerType: 'corporate',
    segment: 'pharmaceutical',
    taxNumber: '1234567890',
    status: 'active',
    paymentTerms: 30,
    // Credit Management Fields
    creditLimit: 100000.00,
    availableCredit: 94100.00,
    totalOutstanding: 5900.00,
    lastPaymentDate: '2024-01-10',
    creditStatus: 'good',
    totalSales: 1250000,
    lastOrderDate: '2024-01-15T10:30:00Z',
    registrationDate: '2023-06-01T00:00:00Z',
    assignedSalesRep: 'Satış Temsilcisi',
    notes: 'Önemli müşteri - özel fiyatlandırma uygulanıyor',
    communicationHistory: [
      {
        id: '1',
        type: 'email',
        subject: 'Yeni ürün kataloğu',
        date: '2024-01-10T14:30:00Z',
        description: 'Yeni ürün kataloğu e-posta ile gönderildi'
      }
    ],
    feedback: [
      {
        id: '1',
        type: 'positive',
        rating: 5,
        comment: 'Hızlı teslimat ve kaliteli ürünler',
        date: '2024-01-05T09:15:00Z'
      }
    ]
  },
  {
    id: '2',
    companyName: 'Sağlık Merkezi XYZ',
    contactPerson: 'Dr. Fatma Kaya',
    email: 'fatma@saglikmerkezixyz.com',
    phone: '+90 216 444 0202',
    address: 'Bağdat Cad. No:456 Kadıköy/İstanbul',
    city: 'İstanbul',
    country: 'Türkiye',
    customerType: 'healthcare',
    segment: 'medical_equipment',
    taxNumber: '2345678901',
    status: 'active',
    paymentTerms: 45,
    // Credit Management Fields
    creditLimit: 75000.00,
    availableCredit: 75000.00,
    totalOutstanding: 0.00,
    lastPaymentDate: '2024-01-20',
    creditStatus: 'good',
    totalSales: 750000,
    lastOrderDate: '2024-01-12T16:45:00Z',
    registrationDate: '2023-08-15T00:00:00Z',
    assignedSalesRep: 'Satış Temsilcisi',
    notes: 'Tıbbi cihaz uzmanı, teknik destek gereksinimi yüksek',
    communicationHistory: [
      {
        id: '2',
        type: 'phone',
        subject: 'Teknik destek talebi',
        date: '2024-01-08T11:20:00Z',
        description: 'Cihaz kurulumu için teknik destek sağlandı'
      }
    ],
    feedback: [
      {
        id: '2',
        type: 'positive',
        rating: 4,
        comment: 'İyi teknik destek, ürün kalitesi memnuniyetkar',
        date: '2024-01-03T13:30:00Z'
      }
    ]
  },
  {
    id: '3',
    companyName: 'Global Pharma Ltd.',
    contactPerson: 'John Smith',
    email: 'john@globalpharma.com',
    phone: '+1 555 123 4567',
    address: '123 Medical Ave, New York, NY 10001',
    city: 'New York',
    country: 'USA',
    customerType: 'international',
    segment: 'pharmaceutical',
    taxNumber: 'US123456789',
    status: 'active',
    paymentTerms: 60,
    // Credit Management Fields
    creditLimit: 120000.00,
    availableCredit: 102300.00,
    totalOutstanding: 17700.00,
    lastPaymentDate: '2024-01-05',
    creditStatus: 'warning',
    totalSales: 2500000,
    lastOrderDate: '2024-01-18T08:15:00Z',
    registrationDate: '2023-03-10T00:00:00Z',
    assignedSalesRep: 'İhracat Uzmanı',
    notes: 'Uluslararası müşteri - özel gümrük prosedürleri gerekli',
    communicationHistory: [
      {
        id: '3',
        type: 'meeting',
        subject: 'Yıllık anlaşma görüşmesi',
        date: '2024-01-15T15:00:00Z',
        description: '2024 yılı için stratejik ortaklık görüşmesi yapıldı'
      }
    ],
    feedback: [
      {
        id: '3',
        type: 'positive',
        rating: 5,
        comment: 'Excellent service and product quality',
        date: '2024-01-12T10:45:00Z'
      }
    ]
  },
  {
    id: '4',
    companyName: 'DEF Sağlık Hizmetleri',
    contactPerson: 'Can Özkan',
    email: 'can@def-saglik.com',
    phone: '+90 312 555 55 66',
    address: 'Kızılay Cad. No:78 Çankaya/Ankara',
    city: 'Ankara',
    country: 'Türkiye',
    customerType: 'prospect',
    segment: 'small',
    taxNumber: '3456789012',
    status: 'prospect',
    paymentTerms: 30,
    // Credit Management Fields
    creditLimit: 25000.00,
    availableCredit: 25000.00,
    totalOutstanding: 0.00,
    lastPaymentDate: null,
    creditStatus: 'good',
    totalSales: 0,
    lastOrderDate: '',
    registrationDate: '2024-01-10T00:00:00Z',
    assignedSalesRep: 'Satış Temsilcisi',
    notes: 'Potansiyel müşteri - ilk görüşme yapıldı',
    communicationHistory: [],
    feedback: []
  }
]

// Mock products data (centralized from products.json)
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cerrahi Maske FFP2',
    sku: 'MASK-FFP2-001',
    description: 'Yüksek filtrasyon kapasiteli cerrahi maske, tek kullanımlık',
    category: 'personal_protection',
    subcategory: 'masks',
    brand: 'MedProtect',
    manufacturer: 'MedProtect GmbH',
    manufacturerCountry: 'Almanya',
    barcode: '8690123456789',
    price: 15.50,
    cost: 8.75,
    currency: 'TRY',
    unit: 'adet',
    packageSize: 50,
    minOrderQuantity: 100,
    stock: {
      current: 15000,
      minimum: 2000,
      maximum: 50000,
      reserved: 500
    },
    supplier: '1',
    isActive: true,
    isMedical: true,
    requiresPrescription: false,
    shelfLife: 36,
    storageConditions: 'Kuru ve serin yerde saklanmalı',
    certifications: ['CE', 'FDA', 'TSE'],
    tags: ['maske', 'cerrahi', 'koruyucu', 'tek kullanımlık'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-18T14:30:00Z',
    lastSoldAt: '2024-12-17T16:20:00Z',
    totalSold: 45000,
    averageRating: 4.8,
    reviews: 156
  },
  {
    id: '2',
    name: 'Eldiven Nitril Mavi',
    sku: 'GLOVE-NIT-002',
    description: 'Pudrasız nitril eldiven, mavi renk, tek kullanımlık',
    category: 'personal_protection',
    subcategory: 'gloves',
    brand: 'SafeHands',
    manufacturer: 'SafeHands Malaysia Sdn Bhd',
    manufacturerCountry: 'Malezya',
    barcode: '8690123456790',
    price: 85.00,
    cost: 52.00,
    currency: 'TRY',
    unit: 'kutu',
    packageSize: 100,
    minOrderQuantity: 50,
    stock: {
      current: 8500,
      minimum: 1000,
      maximum: 20000,
      reserved: 200
    },
    supplier: '1',
    isActive: true,
    isMedical: true,
    requiresPrescription: false,
    shelfLife: 60,
    storageConditions: 'Oda sıcaklığında, nemden uzak',
    certifications: ['CE', 'EN455', 'ASTM'],
    tags: ['eldiven', 'nitril', 'mavi', 'pudrasız'],
    createdAt: '2024-01-18T11:30:00Z',
    updatedAt: '2024-12-17T09:15:00Z',
    lastSoldAt: '2024-12-16T13:45:00Z',
    totalSold: 12300,
    averageRating: 4.6,
    reviews: 89
  },
  {
    id: '3',
    name: 'Dijital Termometre',
    sku: 'THERM-DIG-003',
    description: 'Hızlı okuma özellikli dijital ateş ölçer, LCD ekranlı',
    category: 'medical_devices',
    subcategory: 'diagnostic',
    brand: 'TempCheck',
    manufacturer: 'TempCheck Technologies',
    manufacturerCountry: 'Japonya',
    barcode: '8690123456791',
    price: 125.00,
    cost: 75.00,
    currency: 'TRY',
    unit: 'adet',
    packageSize: 1,
    minOrderQuantity: 10,
    stock: {
      current: 450,
      minimum: 50,
      maximum: 1000,
      reserved: 15
    },
    supplier: '2',
    isActive: true,
    isMedical: true,
    requiresPrescription: false,
    shelfLife: 0,
    storageConditions: 'Kuru yerde saklanmalı',
    certifications: ['CE', 'FDA', 'ISO13485'],
    tags: ['termometre', 'dijital', 'ateş ölçer', 'LCD'],
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-12-16T11:40:00Z',
    lastSoldAt: '2024-12-15T10:30:00Z',
    totalSold: 890,
    averageRating: 4.4,
    reviews: 34
  }
]

// Mock invoices data
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'ABC İlaç A.Ş.',
    issueDate: '2024-02-01T09:00:00Z',
    dueDate: '2024-03-02T23:59:59Z',
    status: 'paid',
    currency: 'TRY',
    subtotal: 125000.00,
    taxAmount: 22500.00,
    totalAmount: 147500.00,
    paidAmount: 147500.00,
    remainingAmount: 0.00,
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Cerrahi Maske FFP2',
        productSku: 'MASK-FFP2-001',
        description: 'Cerrahi Maske FFP2 - 10000 adet',
        quantity: 10000,
        unitPrice: 15.50,
        totalPrice: 155000.00,
        taxRate: 18
      }
    ],
    paymentTerms: {
      paymentDays: 30,
      discountDays: 10,
      discountRate: 2,
      paymentMethod: 'bank_transfer'
    },
    billingAddress: {
      company: 'ABC İlaç A.Ş.',
      address: 'Atatürk Cad. No:123',
      city: 'İstanbul',
      postalCode: '34000',
      country: 'Türkiye'
    },
    notes: 'Zamanında ödeme yapıldı',
    createdBy: '1',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerId: '2',
    customerName: 'Sağlık Merkezi XYZ',
    issueDate: '2024-02-15T10:00:00Z',
    dueDate: '2024-03-17T23:59:59Z',
    status: 'overdue',
    currency: 'TRY',
    subtotal: 85000.00,
    taxAmount: 15300.00,
    totalAmount: 100300.00,
    paidAmount: 50000.00,
    remainingAmount: 50300.00,
    items: [
      {
        id: '2',
        productId: '3',
        productName: 'Dijital Termometre',
        productSku: 'THERM-DIG-003',
        description: 'Dijital Termometre - 100 adet',
        quantity: 100,
        unitPrice: 125.00,
        totalPrice: 12500.00,
        taxRate: 18
      },
      {
        id: '3',
        productId: '2',
        productName: 'Eldiven Nitril Mavi',
        productSku: 'GLOVE-NIT-002',
        description: 'Eldiven Nitril Mavi - 1000 kutu',
        quantity: 1000,
        unitPrice: 85.00,
        totalPrice: 85000.00,
        taxRate: 18
      }
    ],
    paymentTerms: {
      paymentDays: 30,
      discountDays: 0,
      discountRate: 0,
      paymentMethod: 'bank_transfer'
    },
    billingAddress: {
      company: 'Sağlık Merkezi XYZ',
      address: 'Sağlık Sok. No:45',
      city: 'Ankara',
      postalCode: '06000',
      country: 'Türkiye'
    },
    notes: 'Kısmi ödeme alındı, bakiye vadesi geçti',
    createdBy: '1',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z'
  }
]

// Mock payments data
export const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'ABC İlaç A.Ş.',
    amount: 147500.00,
    currency: 'TRY',
    paymentDate: '2024-02-28T14:30:00Z',
    paymentMethod: 'bank_transfer',
    reference: 'TRF-240228-001',
    status: 'completed',
    notes: 'Tam ödeme alındı',
    processedBy: '3',
    processedByName: 'Mali İşler Uzmanı',
    createdAt: '2024-02-28T14:30:00Z'
  },
  {
    id: '2',
    invoiceId: '2',
    invoiceNumber: 'INV-2024-002',
    customerId: '2',
    customerName: 'Sağlık Merkezi XYZ',
    amount: 50000.00,
    currency: 'TRY',
    paymentDate: '2024-03-01T09:15:00Z',
    paymentMethod: 'bank_transfer',
    reference: 'TRF-240301-001',
    status: 'completed',
    notes: 'Kısmi ödeme - bakiye kaldı',
    processedBy: '3',
    processedByName: 'Mali İşler Uzmanı',
    createdAt: '2024-03-01T09:15:00Z'
  }
]

// Helper function to update customer credit status
export const updateCustomerCreditStatus = (customerId: string, newOutstanding: number, paymentDate?: string) => {
  const customerIndex = mockCustomers.findIndex(c => c.id === customerId)
  if (customerIndex !== -1) {
    const customer = mockCustomers[customerIndex]
    
    // Update outstanding and available credit (rounded)
    customer.totalOutstanding = Math.round(Math.max(0, newOutstanding))
    customer.availableCredit = Math.round(customer.creditLimit - customer.totalOutstanding)
    if (paymentDate) {
      customer.lastPaymentDate = paymentDate
    }
    
    // Update credit status based on utilization
    const utilizationRate = customer.totalOutstanding / customer.creditLimit
    if (utilizationRate > 1) {
      customer.creditStatus = 'exceeded'
    } else if (utilizationRate > 0.9) {
      customer.creditStatus = 'warning'
    } else {
      customer.creditStatus = 'good'
    }
    
    return customer
  }
  return null
}

// Helper function to calculate customer totals from invoices
export const recalculateCustomerTotals = (customerId: string) => {
  const customerInvoices = mockInvoices.filter(i => i.customerId === customerId)
  const totalOutstanding = Math.round(customerInvoices.reduce((sum, i) => sum + i.remainingAmount, 0))
  
  return updateCustomerCreditStatus(customerId, totalOutstanding)
}

// Helper function to get customer by ID
export const getCustomerById = (customerId: string) => {
  return mockCustomers.find(c => c.id === customerId)
}

// Helper function to add new customer
export const addCustomer = (customer: Omit<Customer, 'id'>) => {
  const newCustomer = {
    ...customer,
    id: String(mockCustomers.length + 1)
  }
  mockCustomers.push(newCustomer)
  return newCustomer
}

// Helper function to update customer
export const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
  const customerIndex = mockCustomers.findIndex(c => c.id === customerId)
  if (customerIndex !== -1) {
    mockCustomers[customerIndex] = { ...mockCustomers[customerIndex], ...updates }
    return mockCustomers[customerIndex]
  }
  return null
}

// Product Management Helper Functions
export const getProductById = (productId: string) => {
  return mockProducts.find(p => p.id === productId)
}

export const updateProductStock = (productId: string, newStock: number) => {
  const productIndex = mockProducts.findIndex(p => p.id === productId)
  if (productIndex !== -1) {
    mockProducts[productIndex].stock.current = Math.round(Math.max(0, newStock))
    mockProducts[productIndex].updatedAt = new Date().toISOString()
    return mockProducts[productIndex]
  }
  return null
}

export const decreaseProductStock = (productId: string, quantity: number) => {
  const product = getProductById(productId)
  if (product && product.stock.current >= quantity) {
    const newStock = product.stock.current - quantity
    return updateProductStock(productId, newStock)
  }
  return null
}

export const checkStockAvailability = (productId: string, quantity: number) => {
  const product = getProductById(productId)
  if (!product) return false
  return product.stock.current >= quantity
}