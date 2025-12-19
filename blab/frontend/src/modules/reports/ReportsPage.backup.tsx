import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChartBarIcon,
  DocumentChartBarIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import {
  fetchReports,
  generateReport,
  exportReport,
  createReport,
  setSelectedReport,
  updateFilters,
  clearError
} from '../../store/slices/reportsSlice'

const ReportsPage = () => {
  const dispatch = useDispatch()
  const { 
    reports, 
    selectedReport, 
    loading, 
    error, 
    generating,
    exporting,
    pagination,
    filters 
  } = useSelector((state: any) => state.reports)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchReports(filters) as any)
  }, [dispatch, filters])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateFilters({ search: e.target.value, page: 1 }))
  }

  const handleFilterChange = (key: string, value: string) => {
    dispatch(updateFilters({ [key]: value, page: 1 }))
  }

  const handleGenerateReport = async (reportId: string) => {
    await dispatch(generateReport(reportId) as any)
  }

  const handleExportReport = async (reportId: string, format: string = 'json') => {
    if (format === 'pdf') {
      // PDF için özel endpoint kullan
      try {
        const response = await fetch(`/api/reports/${reportId}/export/pdf`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) {
          throw new Error('PDF indirilemedi')
        }
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rapor-${reportId}-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (error) {
        console.error('PDF indirme hatası:', error)
        // TODO: Show notification
      }
    } else {
      const result = await dispatch(exportReport({ reportId, format }) as any)
      
      if (result.payload && result.payload.type === 'blob') {
        // CSV/JSON dosyası indirme işlemi
        const url = window.URL.createObjectURL(result.payload.data)
        const link = document.createElement('a')
        link.href = url
        link.download = result.payload.filename
        link.click()
        window.URL.revokeObjectURL(url)
      }
    }
  }

  const reportTypes = [
    { value: 'sales', label: 'Satış Raporu' },
    { value: 'customer', label: 'Müşteri Raporu' },
    { value: 'inventory', label: 'Envanter Raporu' },
    { value: 'financial', label: 'Finansal Raporu' },
    { value: 'performance', label: 'Performans Raporu' }
  ]

  const reportCategories = [
    { value: 'operational', label: 'Operasyonel' },
    { value: 'strategic', label: 'Stratejik' },
    { value: 'compliance', label: 'Uyumluluk' },
    { value: 'analytics', label: 'Analitik' }
  ]

  const getStatusBadge = (lastGenerated: string | null) => {
    if (!lastGenerated) {
      return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Henüz Oluşturulmadı</span>
    }
    
    const generatedDate = new Date(lastGenerated)
    const now = new Date()
    const hoursDiff = (now.getTime() - generatedDate.getTime()) / (1000 * 60 * 60)
    
    if (hoursDiff < 24) {
      return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Güncel</span>
    } else if (hoursDiff < 168) { // 7 days
      return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Eski</span>
    } else {
      return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Çok Eski</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
            <p className="text-gray-600 mt-2">İş raporlarınızı oluşturun, görüntüleyin ve dışa aktarın</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Yeni Rapor
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between bg-white rounded-lg border p-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rapor ara..."
                value={filters.search}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Türler</option>
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {reportCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Reports Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Raporlar yükleniyor...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12">
          <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Rapor bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">Başlamak için yeni bir rapor oluşturun</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report: any) => (
            <div key={report.id} className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.type}</p>
                  </div>
                </div>
                {getStatusBadge(report.lastGenerated)}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{report.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Kategori:</span>
                  <span className="ml-1">{report.category}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Oluşturan:</span>
                  <span className="ml-1">{report.createdByName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Oluşturulma:</span>
                  <span className="ml-1">{formatDate(report.createdAt)}</span>
                </div>
                {report.lastGenerated && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">Son Oluşturulma:</span>
                    <span className="ml-1">{formatDate(report.lastGenerated)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => dispatch(setSelectedReport(report))}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Görüntüle"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleExportReport(report.id, 'json')}
                    disabled={exporting}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                    title="JSON olarak dışa aktar"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleExportReport(report.id, 'csv')}
                    disabled={exporting}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                    title="CSV olarak dışa aktar"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleExportReport(report.id, 'pdf')}
                    disabled={exporting}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded disabled:opacity-50"
                    title="PDF olarak dışa aktar"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
                
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={generating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded text-sm"
                >
                  {generating ? 'Oluşturuluyor...' : 'Oluştur'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Toplam {pagination.totalItems} rapor, sayfa {pagination.currentPage} / {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleFilterChange('page', String(pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Önceki
            </button>
            <button
              onClick={() => handleFilterChange('page', String(pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      {showCreateModal && (
        <CreateReportModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={() => {
            setShowCreateModal(false)
            dispatch(fetchReports(filters) as any)
          }}
        />
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal 
          report={selectedReport} 
          onClose={() => dispatch(setSelectedReport(null))} 
        />
      )}
    </div>
  )
}

// Create Report Modal Component
const CreateReportModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'sales',
    category: 'operational',
    parameters: {}
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(createReport(formData) as any)
    onSubmit()
  }

  const reportTypes = [
    { value: 'sales', label: 'Satış Raporu' },
    { value: 'customer', label: 'Müşteri Raporu' },
    { value: 'inventory', label: 'Envanter Raporu' },
    { value: 'financial', label: 'Finansal Raporu' },
    { value: 'performance', label: 'Performans Raporu' }
  ]

  const reportCategories = [
    { value: 'operational', label: 'Operasyonel' },
    { value: 'strategic', label: 'Stratejik' },
    { value: 'compliance', label: 'Uyumluluk' },
    { value: 'analytics', label: 'Analitik' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Yeni Rapor Oluştur</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rapor Adı
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rapor Türü
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Report Detail Modal Component  
const ReportDetailModal = ({ report, onClose }: { report: any; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{report.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">Açıklama</h3>
            <p className="text-gray-600">{report.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Tür</h3>
              <p className="text-gray-600">{report.type}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Kategori</h3>
              <p className="text-gray-600">{report.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Oluşturan</h3>
              <p className="text-gray-600">{report.createdByName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Oluşturulma Tarihi</h3>
              <p className="text-gray-600">
                {new Date(report.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {report.lastGenerated && (
            <div>
              <h3 className="font-semibold text-gray-900">Son Oluşturulma Tarihi</h3>
              <p className="text-gray-600">
                {new Date(report.lastGenerated).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900">Parametreler</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify(report.parameters, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage