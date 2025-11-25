import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Download } from 'lucide-react'
import InvoicesList from './components/InvoicesList'
import InvoiceDetail from './components/InvoiceDetail'
import CreateInvoice from './components/CreateInvoice'
import PaymentsList from './components/PaymentsList'
import { fetchDashboardData, fetchInvoices, fetchPayments, recordPayment } from '../../store/slices/financeSlice'
import { generateFinancialSummaryPDF } from '../../utils/AllReportsPDF'

type ViewType = 'invoices' | 'payments' | 'dashboard'
type ModalType = 'create_invoice' | 'invoice_detail' | 'edit_invoice' | 'record_payment' | null

const FinancePage: React.FC = () => {
  const dispatch = useDispatch() as any
  const { dashboardData, invoices, payments } = useSelector((state: any) => state.finance)
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchDashboardData())
    dispatch(fetchInvoices({ limit: 5 })) // Son 5 fatura
    dispatch(fetchPayments({ limit: 5 })) // Son 5 ödeme
  }, [dispatch])

  const handleCreateInvoice = () => {
    setActiveModal('create_invoice')
  }

  const handleEditInvoice = (id: string) => {
    setSelectedInvoiceId(id)
    setActiveModal('edit_invoice')
  }

  const handleViewDetails = (id: string) => {
    setSelectedInvoiceId(id)
    setActiveModal('invoice_detail')
  }

  const handleInvoiceSuccess = () => {
    setActiveModal(null)
    setSelectedInvoiceId(null)
    // Refresh current view data
    if (currentView === 'invoices') {
      // Invoices will be refreshed by the component
    }
  }

  const handleRecordPayment = () => {
    setActiveModal('record_payment')
  }

  const handlePaymentSuccess = () => {
    setActiveModal(null)
    setSelectedInvoiceId(null)
    // Refresh both invoices and payments data
    dispatch(fetchDashboardData())
  }

  const handleViewInvoiceFromPayments = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId)
    setActiveModal('invoice_detail')
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    setSelectedInvoiceId(null)
  }

  const handleExportFinancialSummary = () => {
    generateFinancialSummaryPDF()
  }

  const renderTabButton = (view: ViewType, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        currentView === view
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Finans Özeti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Toplam Gelir</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(dashboardData?.totalRevenue || 0)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Tahsil Edilen</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(dashboardData?.paidAmount || 0)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Bekleyen Tahsilat</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {formatCurrency(dashboardData?.pendingAmount || 0)}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Geciken Tahsilat</p>
                <p className="text-2xl font-bold text-red-900">
                  {formatCurrency(dashboardData?.overdueAmount || 0)}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15.5C3.962 16.333 4.924 18 6.464 18z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Financial Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Toplam Fatura</p>
            <p className="text-xl font-bold text-gray-900">{dashboardData?.totalInvoices || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Toplam Ödeme</p>
            <p className="text-xl font-bold text-gray-900">{dashboardData?.totalPayments || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Aylık Gelir</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(dashboardData?.monthlyRevenue || 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Son Faturalar</h3>
            <button
              onClick={() => setCurrentView('invoices')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Tümünü Gör →
            </button>
          </div>
          <div className="space-y-3">
            {invoices && invoices.length > 0 ? (
              invoices.slice(0, 5).map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'partial' ? 'bg-blue-100 text-blue-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Ödendi' :
                         invoice.status === 'partial' ? 'Kısmi' :
                         invoice.status === 'overdue' ? 'Gecikmiş' : 'Beklemede'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{invoice.customerName}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.totalAmount)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(invoice.id)}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Detay
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Henüz fatura bulunmuyor</p>
                <button
                  onClick={handleCreateInvoice}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  İlk faturanı oluştur →
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Son Ödemeler</h3>
            <button
              onClick={() => setCurrentView('payments')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Tümünü Gör →
            </button>
          </div>
          <div className="space-y-3">
            {payments && payments.length > 0 ? (
              payments.slice(0, 5).map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{payment.invoiceNumber}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'completed' ? 'Tamamlandı' :
                         payment.status === 'pending' ? 'Beklemede' : 'Başarısız'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{payment.customerName}</p>
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewInvoiceFromPayments(payment.invoiceId)}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Fatura
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>Henüz ödeme bulunmuyor</p>
                <button
                  onClick={handleRecordPayment}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  İlk ödemeyi kaydet →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCreateInvoice}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Yeni Fatura</span>
          </button>

          <button
            onClick={() => setCurrentView('invoices')}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">Faturaları Görüntüle</span>
          </button>

          <button
            onClick={() => setCurrentView('payments')}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium">Ödemeleri Görüntüle</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (currentView) {
      case 'invoices':
        return (
          <InvoicesList
            onCreateNew={handleCreateInvoice}
            onEditInvoice={handleEditInvoice}
            onViewDetails={handleViewDetails}
          />
        )
      case 'payments':
        return (
          <PaymentsList
            onRecordPayment={handleRecordPayment}
            onViewInvoice={handleViewInvoiceFromPayments}
          />
        )
      case 'dashboard':
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finans Yönetimi</h1>
          <p className="text-gray-600 mt-1">Faturalar, ödemeler ve mali raporlar</p>
        </div>
        <button
          onClick={handleExportFinancialSummary}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          <Download className="w-5 h-5 mr-2" />
          Finans Raporu PDF
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 pb-4">
        {renderTabButton(
          'dashboard',
          'Dashboard',
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0" />
          </svg>
        )}
        {renderTabButton(
          'invoices',
          'Faturalar',
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        {renderTabButton(
          'payments',
          'Ödemeler',
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Modals */}
      {activeModal === 'create_invoice' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CreateInvoice 
              onClose={handleCloseModal}
              onSuccess={handleInvoiceSuccess}
            />
          </div>
        </div>
      )}

      {activeModal === 'invoice_detail' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <InvoiceDetail 
              onClose={handleCloseModal}
              onEdit={handleEditInvoice}
            />
          </div>
        </div>
      )}

      {activeModal === 'edit_invoice' && selectedInvoiceId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CreateInvoice
              onClose={handleCloseModal}
              onSuccess={handleInvoiceSuccess}
              editMode={true}
              invoiceId={selectedInvoiceId}
            />
          </div>
        </div>
      )}

      {activeModal === 'record_payment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <RecordPaymentModal
              onClose={handleCloseModal}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Record Payment Modal Component
interface RecordPaymentModalProps {
  onClose: () => void
  onSuccess: () => void
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch() as any
  const { invoices } = useSelector((state: any) => state.finance)
  const [paymentData, setPaymentData] = useState({
    invoiceId: '',
    amount: '',
    paymentMethod: 'bank_transfer',
    reference: '',
    notes: ''
  })
  const [errors, setErrors] = useState<any>({})
  const [submitting, setSubmitting] = useState(false)

  const selectedInvoice = invoices.find((inv: any) => inv.id === paymentData.invoiceId)

  const validateForm = () => {
    const newErrors: any = {}
    
    if (!paymentData.invoiceId) {
      newErrors.invoiceId = 'Fatura seçimi zorunludur'
    }
    
    if (!paymentData.amount || Number(paymentData.amount) <= 0) {
      newErrors.amount = 'Geçerli bir tutar giriniz'
    }
    
    if (selectedInvoice && Number(paymentData.amount) > selectedInvoice.remainingAmount) {
      newErrors.amount = 'Ödeme tutarı kalan bakiyeden fazla olamaz'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setSubmitting(true)
    try {
      const result = await dispatch(recordPayment({
        invoiceId: paymentData.invoiceId,
        amount: Number(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        reference: paymentData.reference,
        notes: paymentData.notes,
        paymentDate: new Date().toISOString()
      }))
      
      if (result.type.endsWith('/fulfilled')) {
        onSuccess()
      }
    } catch (error) {
      console.error('Ödeme kaydedilirken hata:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Ödeme Kaydet</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fatura *
          </label>
          <select
            value={paymentData.invoiceId}
            onChange={(e) => setPaymentData({ ...paymentData, invoiceId: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.invoiceId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Fatura seçin...</option>
            {invoices
              .filter((inv: any) => inv.remainingAmount > 0)
              .map((invoice: any) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} - {invoice.customerName} (Kalan: ₺{invoice.remainingAmount.toFixed(2)})
                </option>
              ))}
          </select>
          {errors.invoiceId && (
            <p className="text-sm text-red-600 mt-1">{errors.invoiceId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ödeme Tutarı *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={selectedInvoice?.remainingAmount}
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.amount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {selectedInvoice && (
            <p className="text-xs text-gray-500 mt-1">
              Maksimum: ₺{selectedInvoice.remainingAmount.toFixed(2)}
            </p>
          )}
          {errors.amount && (
            <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ödeme Yöntemi
          </label>
          <select
            value={paymentData.paymentMethod}
            onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="bank_transfer">Banka Havalesi</option>
            <option value="credit_card">Kredi Kartı</option>
            <option value="cash">Nakit</option>
            <option value="check">Çek</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Referans No
          </label>
          <input
            type="text"
            value={paymentData.reference}
            onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="İşlem referans numarası"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notlar
          </label>
          <textarea
            rows={3}
            value={paymentData.notes}
            onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ödeme ile ilgili notlar..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={submitting}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && (
              <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {submitting ? 'Kaydediliyor...' : 'Ödemeyi Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FinancePage