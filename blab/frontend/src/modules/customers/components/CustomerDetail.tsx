import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import {
  fetchCustomerById,
  selectSelectedCustomer,
  selectCustomersLoading,
  selectCustomersError,
  addCommunication,
  addFeedback
} from '../../../store/slices/customersSlice'
import {
  fetchInvoices,
  selectInvoices,
  selectFinanceLoading,
  type Invoice
} from '../../../store/slices/financeSlice'
import {
  fetchSalesOpportunities,
  selectOpportunities,
  selectSalesLoading,
  type SalesOpportunity
} from '../../../store/slices/salesSlice'
import Modal, { ModalBody, ModalFooter } from '../../../components/ui/Modal'

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const customer = useAppSelector(selectSelectedCustomer)
  const isLoading = useAppSelector(selectCustomersLoading)
  const error = useAppSelector(selectCustomersError)
  
  // Finance data
  const invoices = useAppSelector(selectInvoices)
  const financeLoading = useAppSelector(selectFinanceLoading)
  
  // Sales data
  const salesOpportunities = useAppSelector(selectOpportunities)
  const salesLoading = useAppSelector(selectSalesLoading)

  // Modal states
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  
  // Form states
  const [communicationForm, setCommunicationForm] = useState({
    type: 'email',
    subject: '',
    description: ''
  })
  
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'positive',
    rating: 5,
    comment: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerById(id))
      // Fetch related data for this customer
      dispatch(fetchInvoices({ customerId: id }))
      dispatch(fetchSalesOpportunities({ customerId: id }))
    }
  }, [dispatch, id])

  // Event handlers
  const handleAddCommunication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer || isSubmitting) return

    setIsSubmitting(true)
    try {
      await dispatch(addCommunication({
        customerId: customer.id,
        communication: communicationForm
      })).unwrap()
      
      // Reset form and close modal
      setCommunicationForm({
        type: 'email',
        subject: '',
        description: ''
      })
      setShowCommunicationModal(false)
    } catch (error) {
      console.error('İletişim ekleme hatası:', error)
    }
    setIsSubmitting(false)
  }

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer || isSubmitting) return

    setIsSubmitting(true)
    try {
      await dispatch(addFeedback({
        customerId: customer.id,
        feedback: feedbackForm
      })).unwrap()
      
      // Reset form and close modal
      setFeedbackForm({
        type: 'positive',
        rating: 5,
        comment: ''
      })
      setShowFeedbackModal(false)
    } catch (error) {
      console.error('Geri bildirim ekleme hatası:', error)
    }
    setIsSubmitting(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate totals from invoices (for comparison with backend data)
  const calculateFinancialMetrics = () => {
    if (!invoices || invoices.length === 0) {
      return {
        totalSales: 0,
        totalPaid: 0,
        remainingDebt: 0,
        availableCredit: customer?.availableCredit || customer?.creditLimit || 0
      }
    }

    const totalSales = invoices.reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0)
    const totalPaid = invoices.reduce((sum: number, invoice: Invoice) => sum + invoice.paidAmount, 0)
    const remainingDebt = totalSales - totalPaid
    // Use backend's available credit if available, otherwise calculate
    const availableCredit = customer?.availableCredit !== undefined ? customer.availableCredit :
                           Math.max(0, (customer?.creditLimit || 0) - remainingDebt)

    return {
      totalSales,
      totalPaid,
      remainingDebt,
      availableCredit
    }
  }

  const { totalSales, totalPaid, remainingDebt, availableCredit } = calculateFinancialMetrics()

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    }
    
    const statusLabels = {
      active: 'Aktif',
      inactive: 'Pasif',
      pending: 'Beklemede',
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    )
  }

  const getCommunicationTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>
        )
      case 'phone':
        return (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
        )
      case 'meeting':
        return (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        )
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
          <p className="mt-2 text-gray-600">Müşteri bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Hata Oluştu</h3>
          <p className="text-gray-600">{error || 'Müşteri bulunamadı'}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => navigate('/customers')}
              className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90"
            >
              Müşteri Listesine Dön
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Yeniden Dene
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/customers')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.companyName}</h1>
              <p className="text-gray-600">{customer.contactPerson}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/customers/${customer.id}/edit`}
              className="px-4 py-2 border border-primary-blue text-primary-blue rounded-lg hover:bg-primary-blue/5"
            >
              Düzenle
            </Link>
            <button
              onClick={() => setShowCommunicationModal(true)}
              className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90"
            >
              İletişim Ekle
            </button>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Geri Bildirim
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">E-posta</label>
                <p className="mt-1 text-sm text-gray-900">{customer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Telefon</label>
                <p className="mt-1 text-sm text-gray-900">{customer.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Şehir</label>
                <p className="mt-1 text-sm text-gray-900">{customer.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Ülke</label>
                <p className="mt-1 text-sm text-gray-900">{customer.country}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">Adres</label>
                <p className="mt-1 text-sm text-gray-900">{customer.address || '-'}</p>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İş Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Müşteri Tipi</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{customer.customerType.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Segment</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{customer.segment.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Vergi Numarası</label>
                <p className="mt-1 text-sm text-gray-900">{customer.taxNumber || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Satış Temsilcisi</label>
                <p className="mt-1 text-sm text-gray-900">{customer.assignedSalesRep}</p>
              </div>
            </div>
          </div>

          {/* Communication History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Geçmişi</h3>
            {customer.communicationHistory && customer.communicationHistory.length > 0 ? (
              <div className="space-y-4">
                {customer.communicationHistory.map((comm) => (
                  <div key={comm.id} className="flex space-x-3 p-4 border rounded-lg">
                    {getCommunicationTypeIcon(comm.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{comm.subject}</h4>
                        <span className="text-xs text-gray-500">{formatDate(comm.date)}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{comm.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">İletişim kaydı yok</h3>
                <p className="mt-1 text-sm text-gray-500">Henüz bu müşteriyle iletişim kaydı bulunmuyor.</p>
              </div>
            )}
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Geri Bildirimleri</h3>
            {customer.feedback && customer.feedback.length > 0 ? (
              <div className="space-y-4">
                {customer.feedback.map((fb) => (
                  <div key={fb.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {getRatingStars(fb.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {fb.rating}/5 ({fb.type === 'positive' ? 'Olumlu' : fb.type === 'negative' ? 'Olumsuz' : 'Nötr'})
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(fb.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{fb.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Geri bildirim yok</h3>
                <p className="mt-1 text-sm text-gray-500">Henüz bu müşteriden geri bildirim alınmamış.</p>
              </div>
            )}
          </div>

          {/* Customer Invoices */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Müşteri Faturaları</h3>
              <Link
                to={`/finance/invoices/create?customerId=${customer.id}`}
                className="px-3 py-1 bg-primary-blue text-white text-sm rounded-lg hover:bg-primary-blue/90"
              >
                Yeni Fatura
              </Link>
            </div>
            {financeLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-blue"></div>
                <p className="mt-2 text-sm text-gray-600">Faturalar yükleniyor...</p>
              </div>
            ) : invoices && invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fatura No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutar
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.slice(0, 5).map((invoice: Invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(invoice.issueDate)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {invoice.status === 'paid' ? 'Ödendi' :
                             invoice.status === 'pending' ? 'Beklemede' :
                             invoice.status === 'overdue' ? 'Gecikmiş' :
                             invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link
                            to={`/finance/invoices/${invoice.id}`}
                            className="text-primary-blue hover:text-primary-blue/80"
                          >
                            Görüntüle
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {invoices.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link
                      to={`/finance/invoices?customer=${customer.id}`}
                      className="text-primary-blue hover:text-primary-blue/80 text-sm"
                    >
                      Tüm faturaları göster ({invoices.length})
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Fatura yok</h3>
                <p className="mt-1 text-sm text-gray-500">Bu müşteri için henüz fatura oluşturulmamış.</p>
              </div>
            )}
          </div>

          {/* Sales Opportunities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Satış Fırsatları</h3>
              <Link
                to={`/sales/opportunities/create?customerId=${customer.id}`}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                Yeni Fırsat
              </Link>
            </div>
            {salesLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <p className="mt-2 text-sm text-gray-600">Satış fırsatları yükleniyor...</p>
              </div>
            ) : salesOpportunities && salesOpportunities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Başlık
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Değer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Olasılık
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aşama
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kapanış Tarihi
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesOpportunities.slice(0, 5).map((opportunity: SalesOpportunity) => (
                      <tr key={opportunity.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {opportunity.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatCurrency(opportunity.value)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          %{opportunity.probability}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            opportunity.stage === 'won' ? 'bg-green-100 text-green-800' :
                            opportunity.stage === 'lost' ? 'bg-red-100 text-red-800' :
                            opportunity.stage === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {opportunity.stage === 'prospecting' ? 'Arama' :
                             opportunity.stage === 'qualified' ? 'Nitelikli' :
                             opportunity.stage === 'proposal' ? 'Teklif' :
                             opportunity.stage === 'negotiation' ? 'Müzakere' :
                             opportunity.stage === 'won' ? 'Kazanıldı' :
                             opportunity.stage === 'lost' ? 'Kayboldu' :
                             opportunity.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(opportunity.expectedCloseDate)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link
                            to={`/sales/opportunities/${opportunity.id}`}
                            className="text-green-600 hover:text-green-800"
                          >
                            Görüntüle
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {salesOpportunities.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link
                      to={`/sales/opportunities?customer=${customer.id}`}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Tüm fırsatları göster ({salesOpportunities.length})
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Satış fırsatı yok</h3>
                <p className="mt-1 text-sm text-gray-500">Bu müşteri için henüz satış fırsatı oluşturulmamış.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Durum</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Mevcut Durum</label>
                {getStatusBadge(customer.status)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Kayıt Tarihi</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(customer.registrationDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Son Sipariş</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(customer.lastOrderDate)}</p>
              </div>
            </div>
          </div>

          {/* Credit Management */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kredi Yönetimi</h3>
            <div className="space-y-4">
              {/* Credit Status Badge */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Kredi Durumu</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  customer.creditStatus === 'good' ? 'bg-green-100 text-green-800' :
                  customer.creditStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  customer.creditStatus === 'exceeded' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {customer.creditStatus === 'good' ? 'İyi' :
                   customer.creditStatus === 'warning' ? 'Uyarı' :
                   customer.creditStatus === 'exceeded' ? 'Aşıldı' :
                   customer.creditStatus === 'blocked' ? 'Bloklu' :
                   customer.creditStatus}
                </span>
              </div>

              {/* Credit Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Kredi Limiti</label>
                <p className="mt-1 text-lg font-semibold text-blue-600">{formatCurrency(customer.creditLimit || 0)}</p>
                <p className="text-xs text-gray-400">Tanımlanan toplam limit</p>
              </div>

              {/* Available Credit */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Kullanılabilir Kredi</label>
                <p className={`mt-1 text-lg font-semibold ${(customer.availableCredit || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(customer.availableCredit || 0)}
                </p>
                <p className="text-xs text-gray-400">
                  {(customer.availableCredit || 0) <= 0 ? 'Kredi limiti aşıldı!' : 'Mevcut kredi bakiyesi'}
                </p>
              </div>

              {/* Total Outstanding */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Toplam Borç</label>
                <p className="mt-1 text-lg font-semibold text-red-600">{formatCurrency(customer.totalOutstanding || 0)}</p>
                <p className="text-xs text-gray-400">Ödenmemiş toplam tutar</p>
              </div>

              {/* Credit Utilization */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Kredi Kullanım Oranı</label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      ((customer.totalOutstanding || 0) / (customer.creditLimit || 1)) > 0.8 ? 'bg-red-500' :
                      ((customer.totalOutstanding || 0) / (customer.creditLimit || 1)) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(((customer.totalOutstanding || 0) / (customer.creditLimit || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  %{Math.round(((customer.totalOutstanding || 0) / (customer.creditLimit || 1)) * 100)} kullanılıyor
                </p>
              </div>

              {/* Last Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Son Ödeme Tarihi</label>
                <p className="mt-1 text-sm text-gray-900">
                  {customer.lastPaymentDate ? formatDate(customer.lastPaymentDate) : 'Henüz ödeme yapılmamış'}
                </p>
              </div>

              {/* Payment Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Ödeme Vadesi</label>
                <p className="mt-1 text-sm text-gray-900">{customer.paymentTerms || 0} gün</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mali Özet</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Toplam Satış</label>
                <p className="mt-1 text-lg font-semibold text-green-600">{formatCurrency(totalSales)}</p>
                <p className="text-xs text-gray-400">Kesilen tüm faturalar</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Toplam Ödeme</label>
                <p className="mt-1 text-lg font-semibold text-blue-600">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-gray-400">Alınan ödemeler</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Kalan Borç (Fatura Bazlı)</label>
                <p className="mt-1 text-lg font-semibold text-orange-600">{formatCurrency(remainingDebt)}</p>
                <p className="text-xs text-gray-400">Faturalardan hesaplanan bakiye</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notlar</h3>
              <p className="text-sm text-gray-600">{customer.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Communication Modal */}
      <Modal
        isOpen={showCommunicationModal}
        onClose={() => setShowCommunicationModal(false)}
        title="İletişim Geçmişi Ekle"
        size="lg"
      >
        <form onSubmit={handleAddCommunication}>
          <ModalBody>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İletişim Türü
                </label>
                <select
                  value={communicationForm.type}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                >
                  <option value="email">E-posta</option>
                  <option value="phone">Telefon</option>
                  <option value="meeting">Toplantı</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konu
                </label>
                <input
                  type="text"
                  value={communicationForm.subject}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="İletişim konusunu girin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={communicationForm.description}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="İletişim detaylarını girin"
                  required
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={() => setShowCommunicationModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Müşteri Geri Bildirimi Ekle"
        size="lg"
      >
        <form onSubmit={handleAddFeedback}>
          <ModalBody>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geri Bildirim Türü
                </label>
                <select
                  value={feedbackForm.type}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                >
                  <option value="positive">Olumlu</option>
                  <option value="negative">Olumsuz</option>
                  <option value="neutral">Nötr</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Değerlendirme (1-5)
                </label>
                <select
                  value={feedbackForm.rating}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  required
                >
                  <option value={1}>1 - Çok Kötü</option>
                  <option value={2}>2 - Kötü</option>
                  <option value={3}>3 - Orta</option>
                  <option value={4}>4 - İyi</option>
                  <option value={5}>5 - Mükemmel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yorum
                </label>
                <textarea
                  value={feedbackForm.comment}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="Müşteri geri bildirimini girin"
                  required
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={() => setShowFeedbackModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}

export default CustomerDetail