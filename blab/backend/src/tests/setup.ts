// Test Setup for Backend
import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals'

// Mock database connection for tests
const mockDatabase = {
  customers: [],
  products: [],
  sales: [],
  suppliers: [],
  invoices: [],
  tasks: [],
  users: [],
  workflows: [],
  emailTemplates: [],
  smsTemplates: []
}

// Reset database before each test
beforeEach(() => {
  // Reset all mock data
  Object.keys(mockDatabase).forEach(key => {
    mockDatabase[key as keyof typeof mockDatabase] = []
  })
})

// Global test utilities
export const testUtils = {
  // Generate test user
  createTestUser: (role = 'admin') => ({
    id: 'test-user-id',
    email: `test-${role}@blabmarket.com`,
    firstName: 'Test',
    lastName: 'User',
    role: {
      id: `${role}-role-id`,
      name: role,
      permissions: {
        customers: ['read', 'write', 'delete'],
        products: ['read', 'write', 'delete'],
        sales: ['read', 'write', 'delete'],
        suppliers: ['read', 'write', 'delete'],
        finance: ['read', 'write', 'delete'],
        tasks: ['read', 'write', 'delete'],
        reports: ['read', 'write', 'delete'],
        automation: ['read', 'write', 'delete'],
        settings: ['read', 'write', 'delete']
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),

  // Generate test customer
  createTestCustomer: () => ({
    id: 'test-customer-id',
    name: 'Test Hospital',
    email: 'test@hospital.com',
    phone: '+90 555 123 4567',
    address: 'Test Address',
    city: 'Istanbul',
    customerType: 'hospital',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),

  // Generate test product
  createTestProduct: () => ({
    id: 'test-product-id',
    name: 'Test MR Device',
    code: 'TEST-MR-001',
    category: 'medical_imaging',
    unit: 'piece',
    purchasePrice: 50000,
    sellPrice: 75000,
    stock: 5,
    minStock: 2,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),

  // Generate test sale
  createTestSale: () => ({
    id: 'test-sale-id',
    customerId: 'test-customer-id',
    salesPerson: 'test-user-id',
    stage: 'proposal',
    priority: 'medium',
    value: 100000,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    probability: 60,
    description: 'Test sale opportunity',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),

  // Generate JWT token for testing
  generateTestToken: () => 'test-jwt-token-mock',

  // Mock request object
  mockRequest: (body = {}, user = null, params = {}, query = {}) => ({
    body,
    user,
    params,
    query,
    headers: {}
  }),

  // Mock response object
  mockResponse: () => {
    const res: any = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    res.cookie = jest.fn().mockReturnValue(res)
    res.clearCookie = jest.fn().mockReturnValue(res)
    return res
  }
}

export { mockDatabase }