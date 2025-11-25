import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CogIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  PlayIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import {
  fetchWorkflows,
  fetchEmailTemplates,
  fetchSMSTemplates,
  fetchAutomationStats,
  fetchExecutionHistory,
  sendTestEmail,
  sendTestSMS,
  triggerWorkflow,
  setSelectedWorkflow,
  clearError
} from '../../store/slices/automationSlice'

const AutomationPage = () => {
  const dispatch = useDispatch()
  const {
    workflows,
    emailTemplates,
    smsTemplates,
    stats,
    executionHistory,
    selectedWorkflow,
    loading,
    error,
    testEmailLoading,
    testSMSLoading
  } = useSelector((state: any) => state.automation)

  const [activeTab, setActiveTab] = useState('overview')
  const [showTestModal, setShowTestModal] = useState(false)
  const [testModalType, setTestModalType] = useState<'email' | 'sms'>('email')

  useEffect(() => {
    dispatch(fetchWorkflows() as any)
    dispatch(fetchEmailTemplates() as any)
    dispatch(fetchSMSTemplates() as any)
    dispatch(fetchAutomationStats() as any)
    dispatch(fetchExecutionHistory({}))
  }, [dispatch])

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'workflows', name: 'İş Akışları', icon: CogIcon },
    { id: 'templates', name: 'Şablonlar', icon: EnvelopeIcon },
    { id: 'history', name: 'Geçmiş', icon: ClockIcon }
  ]

  const handleTestEmail = (templateId: string) => {
    setTestModalType('email')
    setShowTestModal(true)
  }

  const handleTestSMS = (templateId: string) => {
    setTestModalType('sms')
    setShowTestModal(true)
  }

  const handleTriggerWorkflow = async (workflowId: string, triggerType: string) => {
    await dispatch(triggerWorkflow({ triggerType, data: {} }) as any)
  }

  const getWorkflowStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
        Aktif
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
        Pasif
      </span>
    )
  }

  const getExecutionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'running':
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${duration}ms`
    } else {
      return `${(duration / 1000).toFixed(1)}s`
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Otomasyon</h1>
            <p className="text-gray-600 mt-2">İş akışları, e-posta ve SMS otomasyonları</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Yeni İş Akışı
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </div>
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

      {/* Content */}
      {activeTab === 'overview' && (
        <OverviewTab stats={stats} workflows={workflows} />
      )}

      {activeTab === 'workflows' && (
        <WorkflowsTab 
          workflows={workflows} 
          onTrigger={handleTriggerWorkflow}
          onSelect={setSelectedWorkflow}
          selectedWorkflow={selectedWorkflow}
        />
      )}

      {activeTab === 'templates' && (
        <TemplatesTab 
          emailTemplates={emailTemplates}
          smsTemplates={smsTemplates}
          onTestEmail={handleTestEmail}
          onTestSMS={handleTestSMS}
        />
      )}

      {activeTab === 'history' && (
        <HistoryTab 
          executionHistory={executionHistory}
          getStatusIcon={getExecutionStatusIcon}
          formatDuration={formatDuration}
        />
      )}

      {/* Test Modal */}
      {showTestModal && (
        <TestModal 
          type={testModalType}
          templates={testModalType === 'email' ? emailTemplates : smsTemplates}
          onClose={() => setShowTestModal(false)}
          onSend={testModalType === 'email' ? sendTestEmail : sendTestSMS}
          loading={testModalType === 'email' ? testEmailLoading : testSMSLoading}
        />
      )}
    </div>
  )
}

// Overview Tab Component
const OverviewTab = ({ stats, workflows }: any) => {
  if (!stats) return <div>İstatistikler yükleniyor...</div>

  const statCards = [
    {
      title: 'Toplam İş Akışı',
      value: stats.totalWorkflows,
      icon: CogIcon,
      color: 'blue'
    },
    {
      title: 'Aktif İş Akışı',
      value: stats.activeWorkflows,
      icon: PlayIcon,
      color: 'green'
    },
    {
      title: 'E-posta Şablonu',
      value: stats.totalEmailTemplates,
      icon: EnvelopeIcon,
      color: 'purple'
    },
    {
      title: 'SMS Şablonu',
      value: stats.totalSMSTemplates,
      icon: DevicePhoneMobileIcon,
      color: 'orange'
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trigger Types Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tetikleyici Türleri</h3>
        <div className="space-y-3">
          {Object.entries(stats.workflowsByTrigger || {}).map(([trigger, count]) => (
            <div key={trigger} className="flex items-center justify-between">
              <span className="text-gray-600 capitalize">{trigger.replace('_', ' ')}</span>
              <span className="font-semibold text-gray-900">{count as number} adet</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workflows */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Eklenen İş Akışları</h3>
        <div className="space-y-3">
          {workflows?.slice(0, 5).map((workflow: any) => (
            <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{workflow.name}</p>
                <p className="text-sm text-gray-500">{workflow.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {workflow.isActive ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Workflows Tab Component
const WorkflowsTab = ({ workflows, onTrigger, onSelect, selectedWorkflow }: any) => {
  return (
    <div className="space-y-6">
      {workflows?.length === 0 ? (
        <div className="text-center py-12">
          <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">İş akışı bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">Başlamak için yeni bir iş akışı oluşturun</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows?.map((workflow: any) => (
            <div key={workflow.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CogIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-500">{workflow.trigger.type}</p>
                  </div>
                </div>
                {workflow.isActive ? (
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                    Aktif
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                    Pasif
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{workflow.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Aksiyonlar:</span>
                  <span className="ml-1">{workflow.actions?.length || 0} adet</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Oluşturan:</span>
                  <span className="ml-1">{workflow.createdBy}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Oluşturulma:</span>
                  <span className="ml-1">
                    {new Date(workflow.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={() => onSelect(workflow)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Detayları Görüntüle
                </button>
                
                <button
                  onClick={() => onTrigger(workflow.id, workflow.trigger.type)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center space-x-1"
                >
                  <PlayIcon className="h-4 w-4" />
                  <span>Tetikle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Templates Tab Component
const TemplatesTab = ({ emailTemplates, smsTemplates, onTestEmail, onTestSMS }: any) => {
  const [activeTemplateTab, setActiveTemplateTab] = useState('email')

  return (
    <div className="space-y-6">
      {/* Template Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTemplateTab('email')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTemplateTab === 'email'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          E-posta Şablonları
        </button>
        <button
          onClick={() => setActiveTemplateTab('sms')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTemplateTab === 'sms'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          SMS Şablonları
        </button>
      </div>

      {/* Email Templates */}
      {activeTemplateTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {emailTemplates?.map((template: any) => (
            <div key={template.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.subject}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Değişkenler:</span>
                  <span className="ml-1">{template.variables?.length || 0} adet</span>
                </div>
                {template.variables?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map((variable: string) => (
                      <span key={variable} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {variable}
                      </span>
                    ))}
                    {template.variables.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{template.variables.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => onTestEmail(template.id)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
              >
                Test E-postası Gönder
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SMS Templates */}
      {activeTemplateTab === 'sms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {smsTemplates?.map((template: any) => (
            <div key={template.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <DevicePhoneMobileIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {template.message}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Değişkenler:</span>
                  <span className="ml-1">{template.variables?.length || 0} adet</span>
                </div>
                {template.variables?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable: string) => (
                      <span key={variable} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {variable}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onTestSMS(template.id)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm"
              >
                Test SMS Gönder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// History Tab Component
const HistoryTab = ({ executionHistory, getStatusIcon, formatDuration }: any) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Çalıştırma Geçmişi</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {executionHistory?.map((execution: any) => (
            <div key={execution.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(execution.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{execution.workflowName}</h4>
                    <p className="text-sm text-gray-500">{execution.triggerType}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatDuration(execution.duration)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(execution.executedAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>{execution.actionsExecuted} aksiyon çalıştırıldı</span>
                {execution.errors?.length > 0 && (
                  <span className="text-red-600">
                    {execution.errors.length} hata
                  </span>
                )}
              </div>
              
              {execution.errors?.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                  {execution.errors.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Test Modal Component
const TestModal = ({ type, templates, onClose, onSend, loading }: any) => {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [recipient, setRecipient] = useState('')
  const [testData, setTestData] = useState('{}')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate || !recipient) return
    
    try {
      const data = JSON.parse(testData)
      await onSend({ templateId: selectedTemplate, to: recipient, data })
      onClose()
    } catch (error) {
      console.error('Invalid JSON:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            Test {type === 'email' ? 'E-posta' : 'SMS'} Gönder
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şablon
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Şablon seçin</option>
              {templates?.map((template: any) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'email' ? 'E-posta Adresi' : 'Telefon Numarası'}
            </label>
            <input
              type={type === 'email' ? 'email' : 'tel'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={type === 'email' ? 'ornek@email.com' : '+90 555 123 4567'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Verileri (JSON)
            </label>
            <textarea
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder='{"customerName": "Test Müşteri", "orderNumber": "12345"}'
            />
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
              disabled={loading || !selectedTemplate || !recipient}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AutomationPage