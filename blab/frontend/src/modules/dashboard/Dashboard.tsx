import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../store/slices/authSlice'
import { fetchDashboardData } from '../../store/slices/reportsSlice'
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const { dashboardData, loading } = useSelector((state: any) => state.reports)
  
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    dispatch(fetchDashboardData() as any)
    
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Günaydın')
    } else if (hour < 17) {
      setGreeting('İyi öğleden sonra')
    } else {
      setGreeting('İyi akşamlar')
    }
  }, [dispatch])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getChangeIcon = (value: number) => {
    return value >= 0 ? (
      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    )
  }

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const quickActions = [
    {
      title: 'Yeni Müşteri',
      description: 'Müşteri ekle',
      icon: '👤',
      action: () => navigate('/customers'),
      roles: ['admin', 'sales', 'customer_support']
    },
    {
      title: 'Satış Fırsatı',
      description: 'Fırsat oluştur',
      icon: '🎯',
      action: () => navigate('/sales'),
      roles: ['admin', 'sales']
    },
    {
      title: 'Yeni Görev',
      description: 'Görev oluştur',
      icon: '📝',
      action: () => navigate('/tasks'),
      roles: ['admin', 'sales', 'customer_support', 'import_export']
    },
    {
      title: 'Fatura Oluştur',
      description: 'Yeni fatura',
      icon: '🧾',
      action: () => navigate('/finance/invoices'),
      roles: ['admin', 'finance']
    },
    {
      title: 'Ürün Ekle',
      description: 'Yeni ürün',
      icon: '📦',
      action: () => navigate('/products'),
      roles: ['admin', 'import_export']
    },
    {
      title: 'Tedarikçi Ekle',
      description: 'Yeni tedarikçi',
      icon: '🏭',
      action: () => navigate('/suppliers'),
      roles: ['admin', 'import_export']
    },
    {
      title: 'Rapor Oluştur',
      description: 'Yeni rapor',
      icon: '📊',
      action: () => navigate('/reports'),
      roles: ['admin', 'sales', 'finance']
    },
    {
      title: 'Analitik',
      description: 'Performans analizi',
      icon: '📈',
      action: () => navigate('/analytics'),
      roles: ['admin', 'sales', 'finance']
    }
  ]

  const availableActions = quickActions.filter(action => 
    action.roles.includes(user?.role?.name || '')
  )

  const recentActivities = [
    {
      type: 'customer',
      message: 'ABC Medikal şirketi eklendi',
      time: '2 saat önce',
      icon: '👤',
      color: 'text-blue-600'
    },
    {
      type: 'payment',
      message: 'XYZ İlaç\'dan ₺15,000 ödeme alındı',
      time: '4 saat önce',
      icon: '💰',
      color: 'text-green-600'
    },
    {
      type: 'task',
      message: 'Stok sayımı görevi tamamlandı',
      time: '1 gün önce',
      icon: '📋',
      color: 'text-yellow-600'
    },
    {
      type: 'order',
      message: 'Yeni sipariş: Medikal Aletler Ltd.',
      time: '1 gün önce',
      icon: '🛒',
      color: 'text-purple-600'
    },
    {
      type: 'supplier',
      message: 'Global Med tedarikçisi güncellendi',
      time: '2 gün önce',
      icon: '🏭',
      color: 'text-orange-600'
    }
  ]

  const getRoleSpecificContent = () => {
    switch (user?.role?.name) {
      case 'admin':
        return (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Yönetici Paneli</h2>
                <p className="text-blue-100">
                  Sistem yöneticisi olarak tüm modüllere erişiminiz bulunmaktadır.
                </p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-blue-200" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-blue-100">Aktif Kullanıcılar</p>
                <p className="text-xl font-bold">15</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-blue-100">Sistem Durumu</p>
                <p className="text-xl font-bold">✅ Normal</p>
              </div>
            </div>
          </div>
        )
      case 'sales':
        return (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Satış Performansı</h2>
                <p className="text-green-100">
                  Bu ayki hedeflerinize ulaşma durumunuz.
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-12 w-12 text-green-200" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-green-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-green-100">Hedef Tamamlama</p>
                <p className="text-xl font-bold">78%</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-green-100">Aktif Fırsatlar</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </div>
        )
      case 'finance':
        return (
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Finansal Özet</h2>
                <p className="text-purple-100">
                  Gelir, gider ve karlılık durumunuz.
                </p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-purple-200" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-purple-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-purple-100">Bekleyen Ödemeler</p>
                <p className="text-xl font-bold">₺45,000</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-purple-100">Bu Ay Kar</p>
                <p className="text-xl font-bold">₺123,000</p>
              </div>
            </div>
          </div>
        )
      case 'customer_support':
        return (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Müşteri Destek</h2>
                <p className="text-orange-100">
                  Müşteri talep ve şikayetlerinizin durumu.
                </p>
              </div>
              <UserGroupIcon className="h-12 w-12 text-orange-200" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-orange-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-orange-100">Açık Talepler</p>
                <p className="text-xl font-bold">8</p>
              </div>
              <div className="bg-orange-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-orange-100">Memnuniyet Oranı</p>
                <p className="text-xl font-bold">94%</p>
              </div>
            </div>
          </div>
        )
      case 'import_export':
        return (
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">İthalat/İhracat</h2>
                <p className="text-indigo-100">
                  Tedarik zinciri ve envanter durumu.
                </p>
              </div>
              <ShoppingBagIcon className="h-12 w-12 text-indigo-200" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-indigo-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-indigo-100">Bekleyen Siparişler</p>
                <p className="text-xl font-bold">23</p>
              </div>
              <div className="bg-indigo-400 bg-opacity-30 rounded-lg p-3">
                <p className="text-sm text-indigo-100">Düşük Stok</p>
                <p className="text-xl font-bold text-yellow-300">5</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading && !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Dashboard verileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {greeting}, {user?.firstName} {user?.lastName}!
            </h1>
            <p className="text-gray-600">
              Blabmarket CRM sistemine hoş geldiniz. Rolünüz: <span className="font-semibold">{user?.role?.displayName}</span>
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/analytics')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <DocumentChartBarIcon className="h-4 w-4" />
                <span>Analitik</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Müşteri</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData ? formatNumber(dashboardData.totalCustomers) : '2,847'}
              </p>
              {dashboardData && (
                <div className="flex items-center mt-1">
                  {getChangeIcon(dashboardData.customerGrowth)}
                  <span className={`text-sm ml-1 ${getChangeColor(dashboardData.customerGrowth)}`}>
                    {formatPercentage(dashboardData.customerGrowth)}
                  </span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData ? formatCurrency(dashboardData.totalRevenue) : '₺1,245,890'}
              </p>
              {dashboardData && (
                <div className="flex items-center mt-1">
                  {getChangeIcon(dashboardData.revenueGrowth)}
                  <span className={`text-sm ml-1 ${getChangeColor(dashboardData.revenueGrowth)}`}>
                    {formatPercentage(dashboardData.revenueGrowth)}
                  </span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Sipariş</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData ? formatNumber(dashboardData.totalOrders) : '156'}
              </p>
              {dashboardData && (
                <div className="flex items-center mt-1">
                  {getChangeIcon(dashboardData.orderGrowth)}
                  <span className={`text-sm ml-1 ${getChangeColor(dashboardData.orderGrowth)}`}>
                    {formatPercentage(dashboardData.orderGrowth)}
                  </span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingBagIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData ? formatNumber(dashboardData.totalProducts) : '1,234'}
              </p>
              {dashboardData && (
                <div className="flex items-center mt-1">
                  {getChangeIcon(dashboardData.productGrowth)}
                  <span className={`text-sm ml-1 ${getChangeColor(dashboardData.productGrowth)}`}>
                    {formatPercentage(dashboardData.productGrowth)}
                  </span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hızlı İşlemler
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableActions.slice(0, 8).map((action, index) => (
            <button 
              key={index}
              onClick={action.action}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {action.icon}
                </span>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600">
                    {action.title}
                  </p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      {dashboardData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales by Month */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Aylık Satış Trendi</h2>
              <button 
                onClick={() => navigate('/analytics')}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <span>Detaylar</span>
                <EyeIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {dashboardData.salesByMonth?.slice(0, 6).map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{item.month}</span>
                  <div className="text-right">
                    <p className="text-gray-900 font-semibold">{formatCurrency(item.sales)}</p>
                    <p className="text-gray-500 text-sm">{formatNumber(item.orders)} sipariş</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">En Çok Satan Ürünler</h2>
              <button 
                onClick={() => navigate('/products')}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <span>Tümü</span>
                <EyeIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {dashboardData.topProducts?.slice(0, 6).map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{product.name}</span>
                  <div className="text-right">
                    <p className="text-gray-900 font-semibold">{formatCurrency(product.sales)}</p>
                    <p className="text-gray-500 text-sm">{formatNumber(product.quantity)} adet</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm">Tümünü Gör</button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className={`${activity.color} text-lg`}>{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <ClockIcon className="h-3 w-3 text-gray-400" />
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role-specific content */}
      {getRoleSpecificContent()}

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800">Dikkat Edilmesi Gerekenler</h3>
          </div>
          <ul className="space-y-2 text-yellow-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              5 ürünün stok seviyesi kritik durumda
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              3 müşteriden ödeme bekliyor
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              7 görev teslim tarihi geçti
            </li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center mb-3">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-800">Başarılar</h3>
          </div>
          <ul className="space-y-2 text-green-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Bu ay satış hedefinin %125'i gerçekleşti
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Müşteri memnuniyeti %94'e ulaştı
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              15 yeni müşteri kazanıldı
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard