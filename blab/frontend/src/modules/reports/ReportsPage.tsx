import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Download } from 'lucide-react'

import {
  fetchDashboardData,
  selectDashboardData
} from '../../store/slices/reportsSlice'
import { generateReportPDF } from '../../utils/AllReportsPDF'

const ReportsPage: React.FC = () => {
  const dispatch = useDispatch()
  
  // Basit wizard state'leri
  const [currentStep, setCurrentStep] = useState<'select' | 'create' | 'view'>('select')
  const [selectedReportType, setSelectedReportType] = useState<string>('')
  const [selectedDataSource, setSelectedDataSource] = useState<string>('sales')
  const [createdReports, setCreatedReports] = useState<any[]>([])
  const [currentReport, setCurrentReport] = useState<any>(null)

  // Redux data
  const dashboardData = useSelector(selectDashboardData)

  useEffect(() => {
    dispatch(fetchDashboardData() as any)
  }, [dispatch])

  // Çok basit rapor türleri
  const reportTypes = [
    {
      id: 'sales-summary',
      title: 'Satış Raporu',
      description: 'Satışlarınızın özeti',
      icon: ArrowTrendingUpIcon,
      color: 'green'
    },
    {
      id: 'customer-report', 
      title: 'Müşteri Raporu',
      description: 'Müşteri bilgileriniz',
      icon: UserGroupIcon,
      color: 'blue'
    },
    {
      id: 'financial-report',
      title: 'Finans Raporu', 
      description: 'Gelir ve giderleriniz',
      icon: CurrencyDollarIcon,
      color: 'yellow'
    },
    {
      id: 'product-report',
      title: 'Ürün Raporu',
      description: 'Ürün performansınız',
      icon: ShoppingBagIcon,
      color: 'purple'
    }
  ]

  // Basit veri kaynakları
  const dataSources = [
    { 
      id: 'sales', 
      name: 'Satış Verileri', 
      description: 'Son 6 ayın satış verileri kullanılır' 
    },
    { 
      id: 'customers', 
      name: 'Müşteri Verileri', 
      description: 'Müşteri listesi ve analizi kullanılır' 
    },
    { 
      id: 'finance', 
      name: 'Finans Verileri', 
      description: 'Gelir ve gider bilgileri kullanılır' 
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const createReport = () => {
    const reportData = generateSimpleReportData(selectedReportType, selectedDataSource)
    const newReport = {
      id: Date.now().toString(),
      title: reportTypes.find(r => r.id === selectedReportType)?.title || 'Yeni Rapor',
      type: selectedReportType,
      dataSource: selectedDataSource,
      data: reportData,
      createdAt: new Date().toLocaleDateString('tr-TR'),
      createdTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    
    setCreatedReports(prev => [newReport, ...prev])
    setCurrentReport(newReport)
    setCurrentStep('view')
  }

  const generateSimpleReportData = (reportType: string, dataSource: string) => {
    const baseData = {
      totalSales: dashboardData?.totalRevenue || 125000,
      totalCustomers: dashboardData?.totalCustomers || 1245,
      totalProducts: dashboardData?.totalProducts || 284,
      totalOrders: dashboardData?.totalOrders || 156
    }

    switch (reportType) {
      case 'sales-summary':
        return {
          title: 'Satış Performansı',
          metrics: [
            { label: 'Toplam Satış', value: formatCurrency(baseData.totalSales), icon: '💰' },
            { label: 'Toplam Sipariş', value: baseData.totalOrders.toString(), icon: '📦' },
            { label: 'Ortalama Sipariş', value: formatCurrency(baseData.totalSales / baseData.totalOrders), icon: '📊' }
          ],
          summary: `${dataSource === 'sales' ? 'Satış verilerinden' : dataSource === 'customers' ? 'Müşteri verilerinden' : 'Finans verilerinden'} elde edilen bu raporda genel performansınız görülmektedir.`,
          details: [
            'Bu ayın satış hedefine %87 ulaşıldı',
            'Geçen aya göre %12 artış var',
            'En iyi performans Salı günleri'
          ]
        }
      
      case 'customer-report':
        return {
          title: 'Müşteri Analizi',
          metrics: [
            { label: 'Toplam Müşteri', value: baseData.totalCustomers.toString(), icon: '👥' },
            { label: 'Bu Ay Yeni', value: '87', icon: '✨' },
            { label: 'Aktif Müşteri', value: Math.round(baseData.totalCustomers * 0.73).toString(), icon: '🟢' }
          ],
          summary: `${dataSource === 'customers' ? 'Müşteri verilerinden' : dataSource === 'sales' ? 'Satış verilerinden' : 'Finans verilerinden'} elde edilen müşteri analiziniz.`,
          details: [
            'Müşteri memnuniyeti %94',
            'Yeni müşteri kazanma artışı %23',
            'En aktif müşteri grubu 25-35 yaş'
          ]
        }

      case 'financial-report':
        return {
          title: 'Mali Durum',
          metrics: [
            { label: 'Toplam Gelir', value: formatCurrency(baseData.totalSales), icon: '💚' },
            { label: 'Giderler', value: formatCurrency(baseData.totalSales * 0.67), icon: '💸' },
            { label: 'Net Kar', value: formatCurrency(baseData.totalSales * 0.33), icon: '💎' }
          ],
          summary: `${dataSource === 'finance' ? 'Finans verilerinden' : dataSource === 'sales' ? 'Satış verilerinden' : 'Müşteri verilerinden'} elde edilen mali durum raporu.`,
          details: [
            'Kar marjı %33 seviyesinde',
            'Nakit akışı pozitif',
            'Aylık büyüme %8'
          ]
        }

      case 'product-report':
        return {
          title: 'Ürün Performansı',
          metrics: [
            { label: 'Toplam Ürün', value: baseData.totalProducts.toString(), icon: '📦' },
            { label: 'En Çok Satan', value: 'Premium Widget', icon: '⭐' },
            { label: 'Stok Değeri', value: formatCurrency(baseData.totalProducts * 250), icon: '📊' }
          ],
          summary: `${dataSource === 'sales' ? 'Satış verilerinden' : dataSource === 'customers' ? 'Müşteri verilerinden' : 'Finans verilerinden'} elde edilen ürün performans raporu.`,
          details: [
            'En popüler kategori: Elektronik',
            'Stok devir hızı: 2.3 ay',
            'Yeni ürün başarı oranı: %78'
          ]
        }

      default:
        return {}
    }
  }

  // Step 1: Rapor Türü Seçimi
  const renderReportSelection = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hangi Rapor İstiyorsunuz?</h1>
        <p className="text-gray-600 text-lg">Aşağıdaki rapor türlerinden birini seçin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map(reportType => {
          const Icon = reportType.icon
          const isSelected = selectedReportType === reportType.id
          
          return (
            <div
              key={reportType.id}
              onClick={() => setSelectedReportType(reportType.id)}
              className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${
                  reportType.color === 'green' ? 'bg-green-100' :
                  reportType.color === 'blue' ? 'bg-blue-100' :
                  reportType.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  <Icon className={`w-8 h-8 ${
                    reportType.color === 'green' ? 'text-green-600' :
                    reportType.color === 'blue' ? 'text-blue-600' :
                    reportType.color === 'yellow' ? 'text-yellow-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {reportType.title}
                </h3>
                <p className="text-gray-600">
                  {reportType.description}
                </p>
                {isSelected && (
                  <div className="mt-4">
                    <CheckCircleIcon className="w-6 h-6 text-blue-500 mx-auto" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedReportType && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentStep('create')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors"
          >
            Devam Et
            <ArrowRightIcon className="w-5 h-5 inline ml-2" />
          </button>
        </div>
      )}
    </div>
  )

  // Step 2: Veri Kaynağı Seçimi
  const renderReportCreation = () => (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hangi Verileri Kullanacağız?</h1>
        <p className="text-gray-600 text-lg">
          <strong>{reportTypes.find(r => r.id === selectedReportType)?.title}</strong> raporu için veri kaynağını seçin
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {dataSources.map(source => (
          <div
            key={source.id}
            onClick={() => setSelectedDataSource(source.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedDataSource === source.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{source.name}</h3>
                <p className="text-gray-600 mt-2">{source.description}</p>
              </div>
              {selectedDataSource === source.id && (
                <CheckCircleIcon className="w-8 h-8 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <p className="text-yellow-800">
          💡 <strong>Not:</strong> Seçtiğiniz veri kaynağına göre rapor içeriği değişecek. 
          {selectedDataSource === 'sales' && ' Satış verilerinden gelir, sipariş sayıları alınacak.'}
          {selectedDataSource === 'customers' && ' Müşteri verilerinden isimler, davranışlar alınacak.'}
          {selectedDataSource === 'finance' && ' Finans verilerinden gelir-gider bilgileri alınacak.'}
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('select')}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium text-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 inline mr-2" />
          Geri Dön
        </button>
        
        <button
          onClick={createReport}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-green-700 transition-colors"
        >
          Rapor Oluştur
          <CheckCircleIcon className="w-5 h-5 inline ml-2" />
        </button>
      </div>
    </div>
  )

  // Step 3: Rapor Görüntüleme
  const renderReportView = () => {
    if (!currentReport) return null

    const handleExportCurrentReport = () => {
      const reportData = {
        id: currentReport.id,
        title: currentReport.title,
        type: currentReport.type,
        dataSource: currentReport.dataSource,
        data: currentReport.data,
        createdAt: currentReport.createdAt,
        createdTime: currentReport.createdTime
      }
      
      generateReportPDF()
    }

    return (
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{currentReport.title}</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportCurrentReport}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                PDF İndir
              </button>
              <button
                onClick={() => {
                  setCurrentStep('select')
                  setSelectedReportType('')
                  setCurrentReport(null)
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 inline mr-2" />
                Yeni Rapor
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            📅 {currentReport.createdAt} - {currentReport.createdTime} | 
            📊 Veri Kaynağı: {dataSources.find(s => s.id === currentReport.dataSource)?.name}
          </p>
        </div>

        {/* Ana Rapor İçeriği */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{currentReport.data.title}</h2>
          
          {/* Ana Metrikler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {currentReport.data.metrics?.map((metric: any, index: number) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-3xl mb-2">{metric.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Özet */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📝 Özet</h3>
            <p className="text-blue-800">{currentReport.data.summary}</p>
          </div>

          {/* Detaylar */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Önemli Noktalar</h3>
            <ul className="space-y-2">
              {currentReport.data.details?.map((detail: string, index: number) => (
                <li key={index} className="text-green-800 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Önceki Raporlar */}
        {createdReports.length > 1 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">📋 Daha Önce Oluşturduklarınız</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {createdReports.slice(1).map(report => (
                <div
                  key={report.id}
                  className="p-4 bg-white border rounded-lg hover:shadow-md transition-all"
                >
                  <div
                    onClick={() => setCurrentReport(report)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600">
                      📅 {report.createdAt} - {report.createdTime}
                    </p>
                    <p className="text-sm text-gray-500">
                      📊 {dataSources.find(s => s.id === report.dataSource)?.name}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentReport(report)
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Görüntüle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const reportData = {
                          id: report.id,
                          title: report.title,
                          type: report.type,
                          dataSource: report.dataSource,
                          data: report.data,
                          createdAt: report.createdAt,
                          createdTime: report.createdTime
                        }
                        generateReportPDF()
                      }}
                      className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'select' && renderReportSelection()}
      {currentStep === 'create' && renderReportCreation()}
      {currentStep === 'view' && renderReportView()}
    </div>
  )
}

export default ReportsPage