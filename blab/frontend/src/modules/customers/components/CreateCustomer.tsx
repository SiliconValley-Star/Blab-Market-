import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AppDispatch } from '../../../store'
import { createCustomer } from '../../../store/slices/customersSlice'

// Validation schema
const customerSchema = yup.object({
  companyName: yup
    .string()
    .required('Şirket adı gereklidir')
    .min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  contactPerson: yup
    .string()
    .required('İletişim kişisi gereklidir')
    .min(2, 'İletişim kişisi en az 2 karakter olmalıdır'),
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi girin')
    .required('E-posta adresi gereklidir'),
  phone: yup
    .string()
    .required('Telefon numarası gereklidir')
    .min(10, 'Telefon numarası en az 10 karakter olmalıdır'),
  address: yup.string(),
  city: yup.string(),
  country: yup.string().default('Türkiye'),
  customerType: yup.string().default('corporate'),
  segment: yup.string().default('pharmaceutical'),
  taxNumber: yup.string(),
  paymentTerms: yup.number().min(0, 'Ödeme vadesi 0\'dan küçük olamaz').default(30),
  creditLimit: yup.number().min(0, 'Kredi limiti 0\'dan küçük olamaz').default(0),
  totalSales: yup.number().min(0, 'Toplam satış 0\'dan küçük olamaz').default(0),
  lastOrderDate: yup.string().nullable(),
  notes: yup.string(),
})

type CustomerFormData = yup.InferType<typeof customerSchema>

const CreateCustomer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      country: 'Türkiye',
      customerType: 'corporate',
      segment: 'pharmaceutical',
      paymentTerms: 30,
      creditLimit: 0,
      totalSales: 0,
      lastOrderDate: null,
    }
  })

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true)
    try {
      await dispatch(createCustomer(data)).unwrap()
      navigate('/customers')
    } catch (error) {
      console.error('Müşteri oluşturma hatası:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const customerTypes = [
    { value: 'corporate', label: 'Kurumsal' },
    { value: 'healthcare', label: 'Sağlık Kuruluşu' },
    { value: 'international', label: 'Uluslararası' },
  ]

  const segments = [
    { value: 'pharmaceutical', label: 'İlaç' },
    { value: 'medical_equipment', label: 'Tıbbi Cihaz' },
    { value: 'healthcare', label: 'Sağlık Hizmeti' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yeni Müşteri Ekle</h1>
            <p className="text-gray-600 mt-1">Sisteme yeni bir müşteri ekleyin</p>
          </div>
          <button
            onClick={() => navigate('/customers')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Geri Dön
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı *
                </label>
                <input
                  {...register('companyName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="ABC İlaç A.Ş."
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İletişim Kişisi *
                </label>
                <input
                  {...register('contactPerson')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="Ahmet Yılmaz"
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="ahmet@abc.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="+90 212 555 01 02"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adres Bilgileri</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="Maslak Mah. Büyükdere Cad. No:123"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir
                  </label>
                  <input
                    {...register('city')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                    placeholder="İstanbul"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ülke
                  </label>
                  <input
                    {...register('country')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                    placeholder="Türkiye"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">İş Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Müşteri Tipi
                </label>
                <select
                  {...register('customerType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                >
                  {customerTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.customerType && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segment
                </label>
                <select
                  {...register('segment')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                >
                  {segments.map(segment => (
                    <option key={segment.value} value={segment.value}>
                      {segment.label}
                    </option>
                  ))}
                </select>
                {errors.segment && (
                  <p className="mt-1 text-sm text-red-600">{errors.segment.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vergi Numarası
                </label>
                <input
                  {...register('taxNumber')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="1234567890"
                />
                {errors.taxNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ödeme Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Vadesi (gün)
                </label>
                <input
                  {...register('paymentTerms', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="30"
                />
                {errors.paymentTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentTerms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kredi Limiti (TL)
                </label>
                <input
                  {...register('creditLimit', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="500000"
                />
                {errors.creditLimit && (
                  <p className="mt-1 text-sm text-red-600">{errors.creditLimit.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sales Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Satış Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toplam Satış (TL)
                </label>
                <input
                  {...register('totalSales', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="0"
                />
                {errors.totalSales && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalSales.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Son Sipariş Tarihi
                </label>
                <input
                  {...register('lastOrderDate')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                />
                {errors.lastOrderDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastOrderDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notlar</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özel Notlar
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                placeholder="Müşteri hakkında özel notlar..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                'Müşteri Ekle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCustomer