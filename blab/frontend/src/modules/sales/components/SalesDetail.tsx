import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  fetchSalesOpportunityById,
  updateSalesOpportunity,
  addSalesActivity,
  deleteSalesOpportunity,
  SalesOpportunity,
  Activity
} from '../../../store/slices/salesSlice'

const SalesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedOpportunity: opportunity, loading, error, updating } = useSelector((state: any) => state.sales)

  const [showActivityModal, setShowActivityModal] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [newActivity, setNewActivity] = useState({
    type: 'note' as Activity['type'],
    title: '',
    description: ''
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!id) {
      setLocalError('Geçersiz satış fırsatı ID')
      return
    }

    // Clear previous errors
    setLocalError(null)
    
    try {
      dispatch(fetchSalesOpportunityById(id) as any)
        .catch((error: any) => {
          console.error('Sales opportunity fetch error:', error)
          setLocalError('Satış fırsatı yüklenirken hata oluştu')
        })
    } catch (error) {
      console.error('Unexpected error in useEffect:', error)
      setLocalError('Beklenmeyen hata oluştu')
    }
  }, [id, dispatch])

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!opportunity || !newActivity.title) return

    dispatch(addSalesActivity({
      id: opportunity.id,
      activity: newActivity
    }) as any)

    setNewActivity({ type: 'note', title: '', description: '' })
    setShowActivityModal(false)
  }

  const handleDeleteOpportunity = async () => {
    if (!opportunity) return
    
    try {
      const result = await dispatch(deleteSalesOpportunity(opportunity.id) as any)
      if (result.type.endsWith('/fulfilled')) {
        navigate('/sales')
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error)
    }
    setShowDeleteConfirm(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      prospecting: 'bg-gray-100 text-gray-800',
      qualified: 'bg-blue-100 text-blue-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      negotiation: 'bg-orange-100 text-orange-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    }
    return colors[stage] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'call':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        )
      case 'email':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'task':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
    }
  }

  // Error handling
  if (localError || error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-500 mb-4">{localError || error}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => {
                setLocalError(null)
                if (id) {
                  dispatch(fetchSalesOpportunityById(id) as any)
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
            <Link
              to="/sales"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Geri Dön
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Satış fırsatı yükleniyor...</p>
        </div>
      </div>
    )
  }

  // No opportunity found
  if (!opportunity) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Satış Fırsatı Bulunamadı</h2>
          <p className="text-gray-500 mb-4">İstenen satış fırsatı mevcut değil veya erişim izniniz yok.</p>
          <Link
            to="/sales"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Satış Fırsatları Listesine Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <Link to="/sales" className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{opportunity.title}</h1>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStageColor(opportunity.stage)}`}>
              {opportunity.stage === 'prospecting' && 'Potansiyel'}
              {opportunity.stage === 'qualified' && 'Nitelikli'}
              {opportunity.stage === 'proposal' && 'Teklif'}
              {opportunity.stage === 'negotiation' && 'Müzakere'}
              {opportunity.stage === 'won' && 'Kazanıldı'}
              {opportunity.stage === 'lost' && 'Kayıp'}
            </span>
          </div>
          <p className="text-gray-600">{opportunity.description}</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/sales/${opportunity.id}/edit`}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Düzenle
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sil
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Fırsat Değeri</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(opportunity.value)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Başarı Olasılığı</p>
            <p className="text-2xl font-bold text-green-600">%{opportunity.probability}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Öncelik</p>
            <span className={`inline-flex px-3 py-1 text-lg font-semibold rounded-full ${getPriorityColor(opportunity.priority)}`}>
              {opportunity.priority === 'high' && 'Yüksek'}
              {opportunity.priority === 'medium' && 'Orta'}
              {opportunity.priority === 'low' && 'Düşük'}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Tahmini Kapanış</p>
            <p className="text-lg font-semibold text-gray-900">{formatDate(opportunity.expectedCloseDate)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Müşteri Adı</p>
                <p className="text-gray-900">{opportunity.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">İletişim Kişisi</p>
                <p className="text-gray-900">{opportunity.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Atanan Kişi</p>
                <p className="text-gray-900">{opportunity.assignedToName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Kaynak</p>
                <p className="text-gray-900">
                  {opportunity.source === 'website' && 'Web Sitesi'}
                  {opportunity.source === 'referral' && 'Referans'}
                  {opportunity.source === 'cold_call' && 'Soğuk Arama'}
                  {opportunity.source === 'marketing' && 'Pazarlama'}
                  {opportunity.source === 'other' && 'Diğer'}
                </p>
              </div>
            </div>
          </div>

          {/* Products */}
          {opportunity.products && opportunity.products.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İlgili Ürünler</h3>
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
                    {opportunity.products.map((product: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.productName}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.quantity}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(product.unitPrice)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(product.quantity * product.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Competitors */}
          {opportunity.competitors && opportunity.competitors.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rakipler</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.competitors.map((competitor: string, index: number) => (
                  <span key={index} className="inline-flex px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {opportunity.notes && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notlar</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{opportunity.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Activities & Actions */}
        <div className="space-y-6">
          {/* Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Aktiviteler</h3>
              <button
                onClick={() => setShowActivityModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
              >
                + Aktivite Ekle
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {opportunity.activities && opportunity.activities.length > 0 ? (
                [...opportunity.activities]
                  .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((activity: any) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDateTime(activity.date)} • {activity.performedBy}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Henüz aktivite bulunmuyor</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Yeni Aktivite Ekle</h3>
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddActivity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aktivite Tipi</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as Activity['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="note">Not</option>
                    <option value="call">Arama</option>
                    <option value="meeting">Toplantı</option>
                    <option value="email">E-posta</option>
                    <option value="task">Görev</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowActivityModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15.5C3.962 16.333 4.924 18 6.464 18z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                Satış Fırsatını Sil
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Bu işlem geri alınamaz. "{opportunity?.title}" adlı satış fırsatını kalıcı olarak silmek istediğinizden emin misiniz?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleDeleteOpportunity}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesDetail