import React, { useState, useCallback, useRef } from 'react'
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PhotoIcon,
  Cog6ToothIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  PaperAirplaneIcon,
  EyeIcon,
  ShareIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

// Export Types
export interface ExportConfig {
  type: 'pdf' | 'excel' | 'csv' | 'png' | 'svg'
  format: {
    pageSize: 'A4' | 'A3' | 'Letter' | 'Legal'
    orientation: 'portrait' | 'landscape'
    margins: {
      top: number
      right: number
      bottom: number
      left: number
    }
    includeCover: boolean
    includeHeader: boolean
    includeFooter: boolean
    watermark?: string
  }
  content: {
    includeCharts: boolean
    includeData: boolean
    includeFilters: boolean
    chartResolution: 'low' | 'medium' | 'high'
    dataFormat: 'table' | 'raw'
  }
  branding: {
    logo?: File | string
    companyName: string
    reportTitle: string
    subtitle?: string
    author: string
  }
  schedule?: {
    enabled: boolean
    frequency: 'once' | 'daily' | 'weekly' | 'monthly'
    time: string
    recipients: string[]
    subject: string
    message: string
  }
}

// Export Preview Component
const ExportPreview: React.FC<{
  config: ExportConfig
  reportData: any
}> = ({ config, reportData }) => {
  const previewRef = useRef<HTMLDivElement>(null)

  const renderPreviewContent = () => {
    return (
      <div className="bg-white p-8 shadow-sm border border-gray-200 rounded-lg">
        {/* Cover Page */}
        {config.format.includeCover && (
          <div className="text-center mb-8 pb-8 border-b border-gray-200">
            {config.branding.logo && (
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded mx-auto flex items-center justify-center">
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {config.branding.reportTitle}
            </h1>
            {config.branding.subtitle && (
              <h2 className="text-xl text-gray-600 mb-4">
                {config.branding.subtitle}
              </h2>
            )}
            <div className="text-sm text-gray-500">
              <p>{config.branding.companyName}</p>
              <p>Hazırlayan: {config.branding.author}</p>
              <p>Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        )}

        {/* Header */}
        {config.format.includeHeader && (
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {config.branding.reportTitle}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Sayfa 1
            </div>
          </div>
        )}

        {/* Content Preview */}
        <div className="space-y-6">
          {/* Charts Section */}
          {config.content.includeCharts && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Grafikler</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Satış Trendi</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Gelir Analizi</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Table Section */}
          {config.content.includeData && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Veri Tablosu</h4>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Satış
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gelir
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2024-02-20
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺125,000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺98,750
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {config.format.includeFooter && (
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
            <div>
              {config.branding.companyName} - Gizli ve Özel
            </div>
            <div>
              Oluşturulma: {new Date().toLocaleString('tr-TR')}
            </div>
          </div>
        )}

        {/* Watermark */}
        {config.format.watermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <div className="transform rotate-45 text-6xl font-bold text-gray-400">
              {config.format.watermark}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Önizleme</h3>
        <p className="text-sm text-gray-600">
          {config.type.toUpperCase()} • {config.format.pageSize} • {config.format.orientation}
        </p>
      </div>
      
      <div 
        ref={previewRef}
        className="border border-gray-300 rounded-lg overflow-hidden"
        style={{
          aspectRatio: config.format.orientation === 'portrait' ? '0.707' : '1.414'
        }}
      >
        <div className="transform scale-50 origin-top-left" style={{ width: '200%', height: '200%' }}>
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  )
}

// Export Configuration Panel
const ExportConfigPanel: React.FC<{
  config: ExportConfig
  onConfigChange: (updates: Partial<ExportConfig>) => void
}> = ({ config, onConfigChange }) => {
  const updateConfig = (section: keyof ExportConfig, updates: any) => {
    onConfigChange({
      [section]: { ...config[section] as any, ...updates }
    })
  }

  return (
    <div className="space-y-6">
      {/* Export Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Dışa Aktarma Türü
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: 'pdf', label: 'PDF', icon: DocumentTextIcon, desc: 'Formatlanmış rapor' },
            { type: 'excel', label: 'Excel', icon: TableCellsIcon, desc: 'Hesap tablosu' },
            { type: 'png', label: 'PNG', icon: PhotoIcon, desc: 'Resim formatı' },
            { type: 'csv', label: 'CSV', icon: DocumentArrowDownIcon, desc: 'Ham veri' }
          ].map(({ type, label, icon: Icon, desc }) => (
            <button
              key={type}
              onClick={() => onConfigChange({ type: type as any })}
              className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                config.type === type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`w-8 h-8 mb-2 ${
                config.type === type ? 'text-blue-600' : 'text-gray-600'
              }`} />
              <div className="text-sm font-medium text-gray-900 mb-1">
                {label}
              </div>
              <div className="text-xs text-gray-500">
                {desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format Settings */}
      {config.type === 'pdf' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sayfa Formatı
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={config.format.pageSize}
                onChange={(e) => updateConfig('format', { pageSize: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
              <select
                value={config.format.orientation}
                onChange={(e) => updateConfig('format', { orientation: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="portrait">Dikey</option>
                <option value="landscape">Yatay</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { key: 'includeCover', label: 'Kapak Sayfası' },
              { key: 'includeHeader', label: 'Sayfa Başlığı' },
              { key: 'includeFooter', label: 'Sayfa Altlığı' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(config.format as any)[key]}
                  onChange={(e) => updateConfig('format', { [key]: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filigran (opsiyonel)
            </label>
            <input
              type="text"
              value={config.format.watermark || ''}
              onChange={(e) => updateConfig('format', { watermark: e.target.value })}
              placeholder="TASLAK, GİZLİ, vb."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Content Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">İçerik Ayarları</h4>
        
        <div className="space-y-3">
          {[
            { key: 'includeCharts', label: 'Grafikleri Dahil Et' },
            { key: 'includeData', label: 'Veri Tablolarını Dahil Et' },
            { key: 'includeFilters', label: 'Filtreleri Göster' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={(config.content as any)[key]}
                onChange={(e) => updateConfig('content', { [key]: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        {config.content.includeCharts && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grafik Çözünürlüğü
            </label>
            <select
              value={config.content.chartResolution}
              onChange={(e) => updateConfig('content', { chartResolution: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Düşük (Hızlı)</option>
              <option value="medium">Orta (Önerilen)</option>
              <option value="high">Yüksek (Yavaş)</option>
            </select>
          </div>
        )}
      </div>

      {/* Branding */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Marka Bilgileri</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Şirket Adı
            </label>
            <input
              type="text"
              value={config.branding.companyName}
              onChange={(e) => updateConfig('branding', { companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Hazırlayan
            </label>
            <input
              type="text"
              value={config.branding.author}
              onChange={(e) => updateConfig('branding', { author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Rapor Başlığı
          </label>
          <input
            type="text"
            value={config.branding.reportTitle}
            onChange={(e) => updateConfig('branding', { reportTitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Alt Başlık (opsiyonel)
          </label>
          <input
            type="text"
            value={config.branding.subtitle || ''}
            onChange={(e) => updateConfig('branding', { subtitle: e.target.value })}
            placeholder="Rapor açıklaması"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

// Schedule Configuration
const ScheduleConfig: React.FC<{
  config: ExportConfig
  onConfigChange: (updates: Partial<ExportConfig>) => void
}> = ({ config, onConfigChange }) => {
  const schedule = config.schedule || {
    enabled: false,
    frequency: 'once',
    time: '09:00',
    recipients: [],
    subject: '',
    message: ''
  }

  const updateSchedule = (updates: Partial<typeof schedule>) => {
    onConfigChange({
      schedule: { ...schedule, ...updates }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="enable-schedule"
          checked={schedule.enabled}
          onChange={(e) => updateSchedule({ enabled: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <label htmlFor="enable-schedule" className="ml-2 text-sm font-medium text-gray-700">
          Otomatik zamanlama etkinleştir
        </label>
      </div>

      {schedule.enabled && (
        <div className="space-y-4 ml-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Sıklık
              </label>
              <select
                value={schedule.frequency}
                onChange={(e) => updateSchedule({ frequency: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="once">Bir kez</option>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Saat
              </label>
              <input
                type="time"
                value={schedule.time}
                onChange={(e) => updateSchedule({ time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Alıcılar (e-posta adresleri)
            </label>
            <textarea
              value={schedule.recipients.join(', ')}
              onChange={(e) => updateSchedule({ 
                recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
              })}
              placeholder="email1@example.com, email2@example.com"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              E-posta Konusu
            </label>
            <input
              type="text"
              value={schedule.subject}
              onChange={(e) => updateSchedule({ subject: e.target.value })}
              placeholder="Otomatik Rapor - {date}"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              E-posta Mesajı
            </label>
            <textarea
              value={schedule.message}
              onChange={(e) => updateSchedule({ message: e.target.value })}
              placeholder="Merhaba,&#10;&#10;Ekli raporu incelemenizi rica ederim.&#10;&#10;İyi çalışmalar."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Main Export Manager Component
const ReportExportManager: React.FC<{
  reportData?: any
  onExport?: (config: ExportConfig) => void
  onClose?: () => void
}> = ({ reportData, onExport, onClose }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'preview' | 'schedule'>('config')
  const [config, setConfig] = useState<ExportConfig>({
    type: 'pdf',
    format: {
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      includeCover: true,
      includeHeader: true,
      includeFooter: true
    },
    content: {
      includeCharts: true,
      includeData: true,
      includeFilters: false,
      chartResolution: 'medium',
      dataFormat: 'table'
    },
    branding: {
      companyName: 'Blabmarket CRM',
      reportTitle: 'İş Analiz Raporu',
      subtitle: 'Detaylı performans analizi',
      author: 'Sistem Yöneticisi'
    }
  })

  const [isExporting, setIsExporting] = useState(false)

  const updateConfig = useCallback((updates: Partial<ExportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      onExport?.(config)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Configuration Panel */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Dışa Aktar</h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { key: 'config', label: 'Ayarlar', icon: Cog6ToothIcon },
              { key: 'preview', label: 'Önizleme', icon: EyeIcon },
              { key: 'schedule', label: 'Zamanlama', icon: ClockIcon }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'config' && (
            <ExportConfigPanel
              config={config}
              onConfigChange={updateConfig}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleConfig
              config={config}
              onConfigChange={updateConfig}
            />
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isExporting ? (
                <>
                  <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                  Dışa Aktarılıyor...
                </>
              ) : config.schedule?.enabled ? (
                <>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Zamanla
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  Dışa Aktar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'preview' ? (
          <ExportPreview
            config={config}
            reportData={reportData}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <DocumentTextIcon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Rapor Dışa Aktarma
              </h3>
              <p className="text-gray-600">
                Sol panelden ayarlarınızı yapın ve önizleme sekmesinden sonucu görün.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportExportManager