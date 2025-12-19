import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { loginUser, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../store/slices/authSlice'

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Lütfen tüm alanları doldurun')
      return
    }

    try {
      const result = await dispatch(loginUser(formData))
      if (loginUser.fulfilled.match(result)) {
        toast.success('Giriş başarılı!')
      } else {
        toast.error(result.payload as string || 'Giriş başarısız')
      }
    } catch (err) {
      toast.error('Bir hata oluştu')
    }
  }

  const demoAccounts = [
    { email: 'admin@blabmarket.com', password: 'admin123', role: 'Yönetici', icon: '👑', color: 'from-purple-400 to-purple-600' },
    { email: 'satis@blabmarket.com', password: 'satis123', role: 'Satış Ekibi', icon: '💼', color: 'from-blue-400 to-blue-600' },
    { email: 'finans@blabmarket.com', password: 'finans123', role: 'Finans Ekibi', icon: '💰', color: 'from-green-400 to-green-600' },
    { email: 'ithalat@blabmarket.com', password: 'ithalat123', role: 'İthalat/İhracat', icon: '🌍', color: 'from-orange-400 to-orange-600' },
    { email: 'destek@blabmarket.com', password: 'destek123', role: 'Destek Ekibi', icon: '🛠️', color: 'from-red-400 to-red-600' }
  ]

  const fillDemoAccount = (email: string, password: string) => {
    setFormData({ email, password })
  }

  return (
    <div className="min-h-screen animated-glass-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Geometric Shapes - Reduced for Performance */}
      <div className="floating-shape floating-shape-1"></div>
      <div className="floating-shape floating-shape-2"></div>
      <div className="floating-shape floating-shape-3"></div>

      {/* Main Content */}
      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 glass-logo rounded-2xl flex items-center justify-center mb-6 animate-scale-in">
            <div className="flex items-center justify-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                BM
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-slide-in-up">
            Blabmarket CRM
          </h1>
          <p className="text-lg text-white text-opacity-80 animate-slide-in-up">
            Profesyonel İş Yönetimi Sistemi
          </p>
          <p className="text-sm text-white text-opacity-60 mt-2">
            Demo sistemine giriş yapın
          </p>
        </div>

        {/* Login Form */}
        <div className="glass-card-strong rounded-2xl p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="floating-label-container">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="w-full px-4 py-4 glass-input glass-focus-ring rounded-xl text-white placeholder-transparent text-lg font-medium"
              />
              <label htmlFor="email" className="floating-label">
                E-posta Adresi
              </label>
            </div>

            {/* Password Input */}
            <div className="floating-label-container">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="w-full px-4 py-4 glass-input glass-focus-ring rounded-xl text-white placeholder-transparent text-lg font-medium"
              />
              <label htmlFor="password" className="floating-label">
                Şifre
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="glass-card rounded-lg p-4 border-l-4 border-red-400">
                <div className="flex items-center">
                  <span className="text-red-100 text-sm font-medium">⚠️ {error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary glass-focus-ring py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                    <span>Giriş yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Sisteme Giriş Yap</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Demo Accounts Section */}
          <div className="mt-8 pt-6">
            <h3 className="text-lg font-semibold text-white text-opacity-90 mb-4 text-center">
              🎯 Demo Hesapları
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => fillDemoAccount(account.email, account.password)}
                  className="glass-demo-card rounded-xl p-4 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${account.color} flex items-center justify-center text-lg`}>
                        {account.icon}
                      </div>
                      <div>
                        <p className="text-white text-opacity-90 font-semibold text-sm">
                          {account.role}
                        </p>
                        <p className="text-white text-opacity-60 text-xs">
                          {account.email}
                        </p>
                      </div>
                    </div>
                    <div className="glass-button px-3 py-1 rounded-lg">
                      <span className="text-white text-opacity-80 text-xs font-medium">Seç</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Access Tips */}
          <div className="mt-6 pt-4 border-t border-white border-opacity-10">
            <div className="text-center">
              <p className="text-white text-opacity-60 text-xs mb-2">💡 Hızlı Erişim İpucu</p>
              <p className="text-white text-opacity-50 text-xs leading-relaxed">
                Demo hesaplarından birini seçerek sistemi hızlıca keşfedebilirsiniz
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="glass-card rounded-xl p-4 mb-4">
            <p className="text-white text-opacity-80 text-sm font-medium mb-1">
              🌟 Profesyonel CRM Deneyimi
            </p>
            <p className="text-white text-opacity-60 text-xs">
              Modern işletme yönetimi için tasarlandı
            </p>
          </div>
          <p className="text-white text-opacity-50 text-xs">
            © 2024 Blabmarket CRM • Demo Sistemi v2.0
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage