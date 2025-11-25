import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { createSalesOpportunity } from '../../../store/slices/salesSlice'
import { fetchCustomers, selectCustomers } from '../../../store/slices/customersSlice'
import { fetchProducts, selectProducts } from '../../../store/slices/productsSlice'

interface Customer {
  id: string
  companyName: string
  contactPerson: string
  creditLimit?: number
  availableCredit?: number
  totalOutstanding?: number
  creditStatus?: 'good' | 'warning' | 'exceeded' | 'blocked'
}

const CreateSalesOpportunity: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { creating, error } = useAppSelector((state) => state.sales)
  const customers = useAppSelector(selectCustomers)
  const products = useAppSelector(selectProducts)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerId: '',
    customerName: '',
    contactPerson: '',
    value: 0,
    probability: 50,
    stage: 'prospecting',
    priority: 'medium',
    source: 'other',
    expectedCloseDate: '',
    notes: '',
    competitors: [] as string[],
    products: [] as Array<{
      productId: string
      productName: string
      quantity: number
      unitPrice: number
    }>
  })

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [competitorInput, setCompetitorInput] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [creditWarnings, setCreditWarnings] = useState<string[]>([])

  // Refresh data when component mounts
  useEffect(() => {
    const loadInitialData = () => {
      dispatch(fetchCustomers({ page: 1, limit: 100 }) as any)
      dispatch(fetchProducts({ page: 1, limit: 100 }) as any)
    }
    
    loadInitialData()
  }, [dispatch])

  // Refresh data when window gains focus (user comes back from another tab)
  useEffect(() => {
    const handleWindowFocus = () => {
      dispatch(fetchCustomers({ page: 1, limit: 100 }) as any)
      dispatch(fetchProducts({ page: 1, limit: 100 }) as any)
    }

    window.addEventListener('focus', handleWindowFocus)
    return () => window.removeEventListener('focus', handleWindowFocus)
  }, [dispatch])

  // Refresh function for manual refresh
  const refreshData = () => {
    dispatch(fetchCustomers({ page: 1, limit: 100 }) as any)
    dispatch(fetchProducts({ page: 1, limit: 100 }) as any)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value
    const customer = customers.find((c: any) => c.id === customerId)
    
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer ? customer.companyName : '',
      contactPerson: customer ? customer.contactPerson : ''
    }))

    setSelectedCustomer(customer || null)
    
    // Check credit warnings when customer is selected
    if (customer) {
      checkCreditLimits(customer, formData.value)
    } else {
      setCreditWarnings([])
    }
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find((p: any) => p.id === productId)
    if (!product) return

    const isSelected = selectedProducts.includes(productId)
    
    if (isSelected) {
      setSelectedProducts(prev => prev.filter(id => id !== productId))
      setFormData(prev => ({
        ...prev,
        products: prev.products.filter(p => p.productId !== productId)
      }))
    } else {
      setSelectedProducts(prev => [...prev, productId])
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.unitPrice || 0
        }]
      }))
    }
  }

  const handleProductQuantityChange = (productId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.productId === productId ? { ...p, quantity } : p
      )
    }))
  }

  const handleProductPriceChange = (productId: string, unitPrice: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.productId === productId ? { ...p, unitPrice } : p
      )
    }))
  }

  const addCompetitor = () => {
    if (competitorInput.trim() && !formData.competitors.includes(competitorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        competitors: [...prev.competitors, competitorInput.trim()]
      }))
      setCompetitorInput('')
    }
  }

  const removeCompetitor = (competitor: string) => {
    setFormData(prev => ({
      ...prev,
      competitors: prev.competitors.filter(c => c !== competitor)
    }))
  }

  const checkCreditLimits = (customer: Customer, opportunityValue: number) => {
    const warnings: string[] = []
    const creditLimit = customer.creditLimit || 0
    const availableCredit = customer.availableCredit || creditLimit
    const totalOutstanding = customer.totalOutstanding || 0

    if (customer.creditStatus === 'blocked') {
      warnings.push('Bu müşteri kredi engellemesi altında. Yeni satış fırsatı oluşturulamaz.')
    } else if (customer.creditStatus === 'exceeded') {
      warnings.push('Müşteri kredi limiti aşmış durumda.')
    }

    if (opportunityValue > availableCredit && opportunityValue > 0) {
      warnings.push(`Fırsat değeri (${formatCurrency(opportunityValue)}) müşterinin kullanılabilir kredi limitini (${formatCurrency(availableCredit)}) aşıyor.`)
    }

    if (creditLimit > 0 && ((totalOutstanding + opportunityValue) / creditLimit) > 0.8) {
      warnings.push('Bu fırsat müşteriyi kredi limiti uyarı seviyesine yaklaştıracak.')
    }

    setCreditWarnings(warnings)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const getCreditStatusBadge = (status?: string) => {
    if (!status) return null
    
    const statusConfig = {
      good: { label: 'İyi', className: 'bg-green-100 text-green-800' },
      warning: { label: 'Uyarı', className: 'bg-yellow-100 text-yellow-800' },
      exceeded: { label: 'Aşıldı', className: 'bg-red-100 text-red-800' },
      blocked: { label: 'Bloklu', className: 'bg-gray-100 text-gray-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setFormData(prev => ({ ...prev, value }))
    
    // Check credit warnings when value changes
    if (selectedCustomer) {
      checkCreditLimits(selectedCustomer, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.customerId || !formData.expectedCloseDate) {
      return
    }

    // Calculate total value from products if not manually set
    let finalValue = formData.value
    if (formData.products.length > 0 && formData.value === 0) {
      finalValue = formData.products.reduce((sum, product) =>
        sum + (product.quantity * product.unitPrice), 0
      )
      setFormData(prev => ({ ...prev, value: finalValue }))
    }

    // Final credit check before submission
    if (selectedCustomer) {
      checkCreditLimits(selectedCustomer, finalValue)
      
      // Block submission if customer is blocked
      if (selectedCustomer.creditStatus === 'blocked') {
        alert('Bu müşteri kredi engellemesi altında. Fırsat oluşturulamaz.')
        return
      }

      // Show confirmation if credit limit would be exceeded
      if (finalValue > (selectedCustomer.availableCredit || 0)) {
        const confirmMessage = `Bu fırsat müşterinin kredi limitini aşacak. Devam etmek istediğinizden emin misiniz?\n\nKullanılabilir kredi: ${formatCurrency(selectedCustomer.availableCredit || 0)}\nFırsat değeri: ${formatCurrency(finalValue)}`
        if (!confirm(confirmMessage)) {
          return
        }
      }
    }

    const salesData = {
      ...formData,
      value: finalValue,
      stage: formData.stage as "prospecting" | "qualified" | "proposal" | "negotiation",
      priority: formData.priority as "low" | "medium" | "high",
      source: formData.source as "website" | "referral" | "cold_call" | "marketing" | "other"
    }
    const result = await dispatch(createSalesOpportunity(salesData) as any)
    
    if (result.type === 'sales/createOpportunity/fulfilled') {
      navigate('/sales')
    }
  }

  const calculateTotalValue = () => {
    const total = formData.products.reduce((sum, product) =>
      sum + (product.quantity * product.unitPrice), 0
    )
    
    // Update credit warnings when product total changes
    if (selectedCustomer && total !== formData.value) {
      setTimeout(() => checkCreditLimits(selectedCustomer, total), 100)
    }
    
    return total
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/sales')}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Satış Fırsatı</h1>
        <button
          onClick={refreshData}
          className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors flex items-center space-x-2"
          title="Müşteri ve ürün listesini yenile"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm">Yenile</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {creditWarnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Kredi Limiti Uyarıları</h3>
              <div className="mt-2 text-sm text-amber-700">
                <ul className="list-disc list-inside space-y-1">
                  {creditWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fırsat Başlığı *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Müşteri *
              </label>
              <select
                value={formData.customerId}
                onChange={handleCustomerSelect}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Müşteri seçiniz</option>
                {customers.map((customer: any) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName} - {customer.contactPerson}
                    {customer.creditStatus && ` (${customer.creditStatus})`}
                  </option>
                ))}
              </select>
              
              {/* Customer Credit Information */}
              {selectedCustomer && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Kredi Bilgileri</h4>
                    {getCreditStatusBadge(selectedCustomer.creditStatus)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Kredi Limiti:</span>
                      <span className="ml-2 font-medium">
                        {formatCurrency(selectedCustomer.creditLimit || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Kullanılabilir:</span>
                      <span className={`ml-2 font-medium ${(selectedCustomer.availableCredit || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(selectedCustomer.availableCredit || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Toplam Borç:</span>
                      <span className="ml-2 font-medium text-red-600">
                        {formatCurrency(selectedCustomer.totalOutstanding || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Kullanım Oranı:</span>
                      <span className="ml-2 font-medium">
                        %{Math.round(((selectedCustomer.totalOutstanding || 0) / (selectedCustomer.creditLimit || 1)) * 100)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İletişim Kişisi
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fırsat Değeri (TRY)
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleValueChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.products.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Ürünlerden hesaplanan: {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  }).format(calculateTotalValue())}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başarı Olasılığı (%)
              </label>
              <input
                type="number"
                name="probability"
                value={formData.probability}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aşama
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="prospecting">Potansiyel</option>
                <option value="qualified">Nitelikli</option>
                <option value="proposal">Teklif</option>
                <option value="negotiation">Müzakere</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Öncelik
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kaynak
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="website">Web Sitesi</option>
                <option value="referral">Referans</option>
                <option value="cold_call">Soğuk Arama</option>
                <option value="marketing">Pazarlama</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahmini Kapanış Tarihi *
              </label>
              <input
                type="date"
                name="expectedCloseDate"
                value={formData.expectedCloseDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">İlgili Ürünler</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Fırsatla ilgili ürünleri seçin:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
              {products.map((product: any) => (
                <label key={product.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleProductSelect(product.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {formData.products.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Seçili Ürünler</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Miktar</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.products.map((product, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.productName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleProductQuantityChange(product.productId, parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={product.unitPrice}
                            onChange={(e) => handleProductPriceChange(product.productId, parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('tr-TR', {
                            style: 'currency',
                            currency: 'TRY'
                          }).format(product.quantity * product.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  Toplam: {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  }).format(calculateTotalValue())}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Competitors */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Rakipler</h2>
          
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={competitorInput}
              onChange={(e) => setCompetitorInput(e.target.value)}
              placeholder="Rakip firma adı"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
            />
            <button
              type="button"
              onClick={addCompetitor}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Ekle
            </button>
          </div>

          {formData.competitors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.competitors.map((competitor, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                  {competitor}
                  <button
                    type="button"
                    onClick={() => removeCompetitor(competitor)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Notlar</h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            placeholder="Fırsatla ilgili önemli notlar, strateji, müşteri tercihleri vb."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/sales')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={creating}
            className={`px-6 py-2 rounded-lg text-white transition-colors ${
              creating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {creating ? 'Oluşturuluyor...' : 'Fırsatı Oluştur'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateSalesOpportunity