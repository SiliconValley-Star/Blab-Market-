import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ChartBarIcon,
  Squares2X2Icon,
  DocumentDuplicateIcon,
  PlusIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BoltIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

// Import components
import AdvancedChart from '../../components/ui/AdvancedChart'
import ReportWizard, { ReportConfig } from '../../components/ui/ReportWizard'

// Import slices
import {
  fetchDashboardData,
  fetchSalesAnalytics,
  fetchCustomerAnalytics,
  fetchFinancialAnalytics,
  selectDashboardData,
  selectSalesAnalytics,
  selectCustomerAnalytics,
  selectFinancialAnalytics
} from '../../store/slices/reportsSlice'

type TabType = 'dashboard' | 'reports' | 'templates'

interface SavedReport extends ReportConfig {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  status: 'active' | 'draft'
}

const ReportsPage: React.FC = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [savedReports, setSavedReports] = useState<SavedReport[]>([])
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null)

  // Selectors
  const dashboardData = useSelector(selectDashboardData)
  const salesAnalytics = useSelector(selectSalesAnalytics)
  const customerAnalytics = useSelector(selectCustomerAnalytics)
  const financialAnalytics = useSelector(selectFinancialAnalytics)

  useEffect(() => {
    // Load dashboard data on component mount
    dispatch(fetchDashboardData() as any)
    dispatch(fetchSalesAnalytics({}) as any)
    dispatch(fetchCustomerAnalytics() as any)
    dispatch(fetchFinancialAnalytics() as any)
    
    // Load sample reports
    setSavedReports([
      {
        id: '1',
        name: 'Aylık Satış Raporu',
        type: 'chart',
        dataSource: 'sales',
        visualization: { chartType: 'bar', metrics: ['revenue'] },
        filters: {},
        design: { theme: 'default', showLegend: true, showGrid: true, title: 'Aylık Satış Raporu' },
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        createdBy: 'Admin User',
        status: 'active'
      },
      {
        id: '2',
        name: 'Müşteri Analiz Dashboard',
        type: 'dashboard',
        dataSource: 'customers',
        visualization: { metrics: ['total', 'new', 'active'] },
        filters: {},
        design: { theme: 'default', showLegend: true, showGrid: true, title: 'Müşteri Analiz Dashboard' },
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        createdBy: 'Admin User',
        status: 'active'
      },
      {
        id: '3',
        name: 'KPI Özet Kartları',
        type: 'kpi',
        dataSource: 'finance',
        visualization: { metrics: ['revenue', 'profit', 'growth'] },
        filters: {},
        design: { theme: 'default', showLegend: false, showGrid: false, title: 'KPI Özet Kartları' },
        createdAt: '2024-01-08',
        updatedAt: '2024-01-19',
        createdBy: 'Admin User',
        status: 'draft'
      }
    ])
  }, [dispatch])

  // Tab configuration
  const tabs = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Squares2X2Icon,
      color: 'blue'
    },
    {
      id: 'reports',
      name: 'Raporlarım',
      icon: ChartBarIcon,
      color: 'green'
    },
    {
      id: 'templates',
      name: 'Şablonlar',
      icon: DocumentDuplicateIcon,
      color: 'purple'
    }
  ] as const

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleSaveReport = (config: ReportConfig) => {
    const newReport: SavedReport = {
      ...config,
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin User',
      status: 'active'
    }
    
    setSavedReports(prev => [newReport, ...prev])
    setIsWizardOpen(false)
  }

  const handleDeleteReport = (id: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== id))
  }

  const renderTabButton = (tab: any) => {
    const Icon = tab.icon
    const isActive = activeTab === tab.id

    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id as TabType)}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
          isActive
            ? `bg-${tab.color}-600 text-white shadow-lg`
            : `text-gray-600 hover:text-${tab.color}-600 hover:bg-${tab.color}-50`
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{tab.name}</span>
      </button>
    )
  }

  const renderDashboardTab = () => {
    return (
      <div className="space-y-6">
        {/* Status Bar */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <BoltIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Rapor Merkezi</h3>
                <p className="text-blue-100">Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-green-300" />
                <span className="text-sm">Tüm raporlar aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
          >
            <PlusIcon className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Yeni Rapor</h3>
            <p className="text-sm text-green-100">Wizard ile kolay oluştur</p>
          </button>

          <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl">
            <ChartBarIcon className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Toplam Rapor</h3>
            <p className="text-2xl font-bold">{savedReports.length}</p>
          </div>

          <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl">
            <ClockIcon className="w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aktif Rapor</h3>
            <p className="text-2xl font-bold">{savedReports.filter(r => r.status === 'active').length}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Toplam Gelir</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(dashboardData?.totalRevenue || 0)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm ml-1 text-green-600">+{dashboardData?.revenueGrowth || 0}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Toplam Müşteri</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {dashboardData?.totalCustomers || 0}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm ml-1 text-blue-600">+{dashboardData?.customerGrowth || 0}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Aktif Siparişler</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {dashboardData?.totalOrders || 0}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-purple-500" />
                  <span className="text-sm ml-1 text-purple-600">+{dashboardData?.orderGrowth || 0}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ürün Çeşidi</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {dashboardData?.totalProducts || 0}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-sm ml-1 text-orange-600">+{dashboardData?.productGrowth || 0}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Squares2X2Icon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Satış Trendi</h3>
            {dashboardData?.salesByMonth && (
              <AdvancedChart
                data={dashboardData.salesByMonth.map((item: any) => ({
                  label: item.month,
                  value: item.sales,
                  category: 'sales'
                }))}
                type="line"
                title="Aylık Satış Performansı"
                height={300}
                showTrend={true}
              />
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
            <div className="space-y-4">
              {dashboardData?.topProducts?.slice(0, 5).map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.quantity} adet</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(product.sales)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderReportsTab = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Raporlarım</h3>
            <p className="text-gray-600">Oluşturduğunuz raporları yönetin</p>
          </div>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Yeni Rapor
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedReports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{report.design.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <ChartBarIcon className="w-4 h-4 mr-1" />
                        {report.type}
                      </span>
                      <span className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-1" />
                        {report.dataSource}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status === 'active' ? 'Aktif' : 'Taslak'}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  <div>Oluşturulma: {report.createdAt}</div>
                  <div>Son güncelleme: {report.updatedAt}</div>
                  <div>Oluşturan: {report.createdBy}</div>
                </div>

                {/* Preview Area */}
                <div className="h-32 bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    {report.type === 'chart' && <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />}
                    {report.type === 'dashboard' && <Squares2X2Icon className="w-12 h-12 mx-auto mb-2" />}
                    {report.type === 'kpi' && <ArrowTrendingUpIcon className="w-12 h-12 mx-auto mb-2" />}
                    <div className="text-sm">{report.type} Önizlemesi</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Görüntüle
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {savedReports.length === 0 && (
            <div className="col-span-full text-center py-12">
              <ChartBarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz rapor yok</h3>
              <p className="text-gray-500 mb-6">İlk raporunuzu oluşturun</p>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Rapor Oluştur
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderTemplatesTab = () => {
    const templates = [
      {
        id: 'sales-dashboard',
        name: 'Satış Dashboard',
        description: 'Kapsamlı satış performans dashboard',
        type: 'dashboard',
        preview: '📊'
      },
      {
        id: 'customer-analysis',
        name: 'Müşteri Analizi',
        description: 'Müşteri davranış ve trend analizi',
        type: 'chart',
        preview: '👥'
      },
      {
        id: 'finance-kpi',
        name: 'Finans KPI',
        description: 'Temel mali göstergeler',
        type: 'kpi',
        preview: '💰'
      },
      {
        id: 'product-table',
        name: 'Ürün Listesi',
        description: 'Detaylı ürün performans tablosu',
        type: 'table',
        preview: '📋'
      }
    ]

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Rapor Şablonları</h3>
          <p className="text-gray-600">Hazır şablonlarla hızlı başlayın</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{template.preview}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {template.type}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Pre-fill wizard with template
                    setIsWizardOpen(true)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                >
                  Bu Şablonu Kullan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardTab()
      case 'reports':
        return renderReportsTab()
      case 'templates':
        return renderTemplatesTab()
      default:
        return renderDashboardTab()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Raporlar</h1>
          <p className="text-gray-600">Gelişmiş rapor ve analitik sistemi</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white rounded-xl shadow-sm">
          {tabs.map(renderTabButton)}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>
      </div>

      {/* Report Wizard */}
      <ReportWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSave={handleSaveReport}
      />
    </div>
  )
}

export default ReportsPage