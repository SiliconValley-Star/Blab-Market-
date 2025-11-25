import React, { useState, useEffect } from 'react'
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ChartBarIcon,
  Squares2X2Icon,
  TableCellsIcon,
  PresentationChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  EyeIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline'

// Types
export interface ReportConfig {
  name: string
  type: 'dashboard' | 'chart' | 'table' | 'kpi'
  dataSource: 'sales' | 'customers' | 'finance' | 'products' | 'suppliers' | ''
  visualization: {
    chartType?: 'bar' | 'line' | 'pie' | 'area' | 'doughnut'
    metrics?: string[]
    groupBy?: string
    timeRange?: string
  }
  filters: {
    dateRange?: { start: string; end: string }
    categories?: string[]
    status?: string[]
  }
  design: {
    theme: 'default' | 'dark' | 'colorful'
    showLegend: boolean
    showGrid: boolean
    title: string
    subtitle?: string
  }
}

interface WizardProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: ReportConfig) => void
  initialConfig?: Partial<ReportConfig>
}

// Step Components
const Step1TypeSelection: React.FC<{
  config: ReportConfig
  updateConfig: (updates: Partial<ReportConfig>) => void
  isValid: boolean
}> = ({ config, updateConfig, isValid }) => {
  const reportTypes = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Çoklu widget\'larla kapsamlı görünüm',
      icon: Squares2X2Icon,
      color: 'blue'
    },
    {
      id: 'chart',
      name: 'Grafik',
      description: 'Tek bir veri görselleştirmesi',
      icon: ChartBarIcon,
      color: 'green'
    },
    {
      id: 'table',
      name: 'Tablo',
      description: 'Detaylı veri tablosu',
      icon: TableCellsIcon,
      color: 'purple'
    },
    {
      id: 'kpi',
      name: 'KPI Kartı',
      description: 'Anahtar metrikler',
      icon: PresentationChartBarIcon,
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Rapor Türünü Seçin</h3>
        <p className="text-gray-600">Oluşturmak istediğiniz raporun türünü belirleyin</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {reportTypes.map((type) => {
          const Icon = type.icon
          const isSelected = config.type === type.id

          return (
            <button
              key={type.id}
              onClick={() => updateConfig({ type: type.id as any })}
              className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                isSelected
                  ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <Icon className={`w-12 h-12 mx-auto mb-4 ${
                  isSelected ? `text-${type.color}-600` : 'text-gray-500'
                }`} />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const Step2DataSource: React.FC<{
  config: ReportConfig
  updateConfig: (updates: Partial<ReportConfig>) => void
  isValid: boolean
}> = ({ config, updateConfig, isValid }) => {
  const dataSources = [
    {
      id: 'sales',
      name: 'Satış Verileri',
      description: 'Siparişler, gelir, performans',
      icon: ArrowTrendingUpIcon,
      color: 'green',
      available: true
    },
    {
      id: 'customers',
      name: 'Müşteri Verileri',
      description: 'Müşteri bilgileri, davranış analizi',
      icon: UserGroupIcon,
      color: 'blue',
      available: true
    },
    {
      id: 'finance',
      name: 'Finans Verileri',
      description: 'Gelir, gider, kar-zarar',
      icon: CurrencyDollarIcon,
      color: 'yellow',
      available: true
    },
    {
      id: 'products',
      name: 'Ürün Verileri',
      description: 'Stok, kategori, satış performansı',
      icon: ShoppingBagIcon,
      color: 'purple',
      available: true
    },
    {
      id: 'suppliers',
      name: 'Tedarikçi Verileri',
      description: 'Tedarikçi performans, temin süreleri',
      icon: BuildingStorefrontIcon,
      color: 'red',
      available: true
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Veri Kaynağını Seçin</h3>
        <p className="text-gray-600">Raporunuzda kullanmak istediğiniz veri kaynağını belirleyin</p>
      </div>

      <div className="space-y-3">
        {dataSources.map((source) => {
          const Icon = source.icon
          const isSelected = config.dataSource === source.id

          return (
            <button
              key={source.id}
              onClick={() => updateConfig({ dataSource: source.id as any })}
              disabled={!source.available}
              className={`w-full p-4 rounded-lg border-2 transition-all hover:shadow-sm ${
                isSelected
                  ? `border-${source.color}-500 bg-${source.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              } ${!source.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-4">
                <Icon className={`w-8 h-8 ${
                  isSelected ? `text-${source.color}-600` : 'text-gray-500'
                }`} />
                <div className="flex-1 text-left">
                  <h4 className="text-lg font-semibold text-gray-900">{source.name}</h4>
                  <p className="text-sm text-gray-600">{source.description}</p>
                </div>
                {isSelected && (
                  <CheckIcon className={`w-6 h-6 text-${source.color}-600`} />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const Step3Visualization: React.FC<{
  config: ReportConfig
  updateConfig: (updates: Partial<ReportConfig>) => void
  isValid: boolean
}> = ({ config, updateConfig, isValid }) => {
  const getVisualizationOptions = () => {
    if (config.type === 'chart') {
      return {
        title: 'Grafik Türünü Seçin',
        options: [
          { id: 'bar', name: 'Sütun Grafik', icon: '📊' },
          { id: 'line', name: 'Çizgi Grafik', icon: '📈' },
          { id: 'pie', name: 'Pasta Grafik', icon: '🥧' },
          { id: 'area', name: 'Alan Grafik', icon: '🏔️' },
          { id: 'doughnut', name: 'Halka Grafik', icon: '🍩' }
        ]
      }
    } else if (config.type === 'kpi') {
      return {
        title: 'KPI Metriklerini Seçin',
        options: [
          { id: 'revenue', name: 'Toplam Gelir', icon: '💰' },
          { id: 'orders', name: 'Sipariş Sayısı', icon: '📦' },
          { id: 'customers', name: 'Müşteri Sayısı', icon: '👥' },
          { id: 'growth', name: 'Büyüme Oranı', icon: '📈' }
        ]
      }
    } else if (config.type === 'table') {
      return {
        title: 'Tablo Sütunlarını Seçin',
        options: [
          { id: 'basic', name: 'Temel Bilgiler', icon: '📋' },
          { id: 'detailed', name: 'Detaylı Görünüm', icon: '📊' },
          { id: 'summary', name: 'Özet Tablo', icon: '📄' }
        ]
      }
    } else {
      return {
        title: 'Dashboard Layout Seçin',
        options: [
          { id: '2x2', name: '2x2 Grid', icon: '⬜' },
          { id: '3x2', name: '3x2 Grid', icon: '▢' },
          { id: 'custom', name: 'Özel Layout', icon: '🎨' }
        ]
      }
    }
  }

  const { title, options } = getVisualizationOptions()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">Verilerinizin nasıl görüntüleneceğini seçin</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = config.visualization.chartType === option.id || 
                            config.visualization.metrics?.includes(option.id)

          return (
            <button
              key={option.id}
              onClick={() => {
                if (config.type === 'chart') {
                  updateConfig({ 
                    visualization: { ...config.visualization, chartType: option.id as any }
                  })
                } else {
                  const currentMetrics = config.visualization.metrics || []
                  const newMetrics = isSelected 
                    ? currentMetrics.filter(m => m !== option.id)
                    : [...currentMetrics, option.id]
                  updateConfig({ 
                    visualization: { ...config.visualization, metrics: newMetrics }
                  })
                }
              }}
              className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{option.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900">{option.name}</h4>
                {isSelected && (
                  <CheckIcon className="w-6 h-6 text-blue-600 mx-auto mt-2" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const Step4Preview: React.FC<{
  config: ReportConfig
  updateConfig: (updates: Partial<ReportConfig>) => void
  isValid: boolean
}> = ({ config, updateConfig, isValid }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Rapor Önizlemesi</h3>
        <p className="text-gray-600">Raporunuzun son halini kontrol edin</p>
      </div>

      {/* Rapor İsmi */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rapor İsmi
        </label>
        <input
          type="text"
          value={config.design.title}
          onChange={(e) => updateConfig({
            design: { ...config.design, title: e.target.value }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Rapor ismi girin..."
        />
      </div>

      {/* Mock Önizleme */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500 space-y-4">
          {config.type === 'dashboard' && (
            <>
              <Squares2X2Icon className="w-16 h-16 mx-auto text-gray-400" />
              <div>
                <h4 className="text-lg font-medium">{config.design.title || 'Dashboard Önizlemesi'}</h4>
                <p className="text-sm">Veri Kaynağı: {config.dataSource}</p>
                <p className="text-xs">Multi-widget dashboard layout</p>
              </div>
            </>
          )}
          
          {config.type === 'chart' && (
            <>
              <ChartBarIcon className="w-16 h-16 mx-auto text-gray-400" />
              <div>
                <h4 className="text-lg font-medium">{config.design.title || 'Grafik Önizlemesi'}</h4>
                <p className="text-sm">Tür: {config.visualization.chartType}</p>
                <p className="text-xs">Veri: {config.dataSource} verilerinden</p>
              </div>
            </>
          )}

          {config.type === 'table' && (
            <>
              <TableCellsIcon className="w-16 h-16 mx-auto text-gray-400" />
              <div>
                <h4 className="text-lg font-medium">{config.design.title || 'Tablo Önizlemesi'}</h4>
                <p className="text-sm">Veri Kaynağı: {config.dataSource}</p>
                <p className="text-xs">Detaylı veri tablosu</p>
              </div>
            </>
          )}

          {config.type === 'kpi' && (
            <>
              <PresentationChartBarIcon className="w-16 h-16 mx-auto text-gray-400" />
              <div>
                <h4 className="text-lg font-medium">{config.design.title || 'KPI Önizlemesi'}</h4>
                <p className="text-sm">Metrikler: {config.visualization.metrics?.length || 0}</p>
                <p className="text-xs">Anahtar performans göstergeleri</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Konfigürasyon Özeti */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 mb-3">Rapor Ayarları</h5>
        <div className="space-y-2 text-sm text-gray-600">
          <div>Tür: <span className="font-medium">{config.type}</span></div>
          <div>Veri Kaynağı: <span className="font-medium">{config.dataSource}</span></div>
          {config.type === 'chart' && config.visualization.chartType && (
            <div>Grafik Türü: <span className="font-medium">{config.visualization.chartType}</span></div>
          )}
          {config.visualization.metrics && config.visualization.metrics.length > 0 && (
            <div>Metrikler: <span className="font-medium">{config.visualization.metrics.join(', ')}</span></div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Wizard Component
const ReportWizard: React.FC<WizardProps> = ({ isOpen, onClose, onSave, initialConfig = {} }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    type: 'dashboard',
    dataSource: '',
    visualization: {},
    filters: {},
    design: {
      theme: 'default',
      showLegend: true,
      showGrid: true,
      title: 'Yeni Rapor'
    },
    ...initialConfig
  })

  const steps = [
    { title: 'Tür', component: Step1TypeSelection },
    { title: 'Veri', component: Step2DataSource },
    { title: 'Görselleştirme', component: Step3Visualization },
    { title: 'Önizleme', component: Step4Preview }
  ]

  const updateConfig = (updates: Partial<ReportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return !!config.type
      case 1: return !!config.dataSource
      case 2: return true // Visualization is optional in some cases
      case 3: return !!config.design.title
      default: return false
    }
  }

  const canProceed = isStepValid(currentStep)
  const canFinish = isStepValid(0) && isStepValid(1) && isStepValid(3)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSave = () => {
    if (canFinish) {
      onSave(config)
      onClose()
    }
  }

  const handleClose = () => {
    setCurrentStep(0)
    onClose()
  }

  if (!isOpen) return null

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
        
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Yeni Rapor Oluştur</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium ${
                    index < currentStep 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : index === currentStep
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {index < currentStep ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[500px]">
            <CurrentStepComponent 
              config={config}
              updateConfig={updateConfig}
              isValid={canProceed}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Geri
            </button>

            <span className="text-sm text-gray-500">
              {currentStep + 1} / {steps.length}
            </span>

            <div className="flex space-x-3">
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSave}
                  disabled={!canFinish}
                  className={`flex items-center px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                    canFinish
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
                  Raporu Kaydet
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`flex items-center px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                    canProceed
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  İleri
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportWizard