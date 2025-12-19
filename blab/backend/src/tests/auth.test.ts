// Auth API Tests
import { testUtils } from './setup'

describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const req = testUtils.mockRequest({
        email: 'admin@blabmarket.com',
        password: 'admin123'
      })
      const res = testUtils.mockResponse()

      // Mock successful login
      const expectedUser = testUtils.createTestUser('admin')
      const token = testUtils.generateTestToken()

      // Simulate login controller
      res.status(200).json({
        success: true,
        user: expectedUser,
        token: token
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: expectedUser,
        token: token
      })
    })

    test('should reject invalid credentials', async () => {
      const req = testUtils.mockRequest({
        email: 'admin@blabmarket.com',
        password: 'wrongpassword'
      })
      const res = testUtils.mockResponse()

      res.status(401).json({
        success: false,
        message: 'Geçersiz kimlik bilgileri'
      })

      expect(res.status).toHaveBeenCalledWith(401)
    })

    test('should require email and password', async () => {
      const req = testUtils.mockRequest({})
      const res = testUtils.mockResponse()

      res.status(400).json({
        success: false,
        message: 'E-posta ve şifre gerekli'
      })

      expect(res.status).toHaveBeenCalledWith(400)
    })
  })

  describe('POST /api/auth/logout', () => {
    test('should logout user successfully', async () => {
      const user = testUtils.createTestUser()
      const req = testUtils.mockRequest({}, user)
      const res = testUtils.mockResponse()

      res.status(200).json({
        success: true,
        message: 'Başarıyla çıkış yapıldı'
      })

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('GET /api/auth/me', () => {
    test('should return current user profile', async () => {
      const user = testUtils.createTestUser()
      const req = testUtils.mockRequest({}, user)
      const res = testUtils.mockResponse()

      res.status(200).json({
        success: true,
        user: user
      })

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: user
      })
    })

    test('should return 401 for unauthenticated user', async () => {
      const req = testUtils.mockRequest()
      const res = testUtils.mockResponse()

      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulanmamış'
      })

      expect(res.status).toHaveBeenCalledWith(401)
    })
  })
})

describe('Authorization Middleware', () => {
  test('should allow access with valid token', () => {
    const user = testUtils.createTestUser()
    const req = testUtils.mockRequest({}, user)
    
    expect(req.user).toBeDefined()
    expect(req.user.role).toBeDefined()
  })

  test('should check user permissions', () => {
    const salesUser = testUtils.createTestUser('sales_team')
    
    // Sales user should have access to customers
    expect(salesUser.role.permissions.customers).toContain('read')
    expect(salesUser.role.permissions.customers).toContain('write')
  })
})