import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  HomeIcon,
  UsersIcon,
  PackageIcon,
  TrendingUpIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  CheckSquareIcon,
  BarChart3Icon,
  Activity,
  SettingsIcon,
  LogOutIcon,
  Zap,
  Truck,
  MessageCircle
} from 'lucide-react'

import { selectUser } from '../../store/slices/authSlice'
import { logoutUser } from '../../store/slices/authSlice'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Müşteriler', href: '/customers', icon: UsersIcon },
  { name: 'Ürünler', href: '/products', icon: PackageIcon },
  { name: 'Satış', href: '/sales', icon: TrendingUpIcon },
  { name: 'Tedarikçiler', href: '/suppliers', icon: Truck },
  { name: 'Satın Alma', href: '/procurement', icon: ShoppingCartIcon },
  { name: 'Finans', href: '/finance', icon: CreditCardIcon },
  { name: 'Görevler', href: '/tasks', icon: CheckSquareIcon },
  { name: 'Raporlar', href: '/reports', icon: BarChart3Icon },
  { name: 'Analitik', href: '/analytics', icon: Activity },
  { name: 'WhatsApp Analytics', href: '/whatsapp-analytics', icon: MessageCircle },
  { name: 'Otomasyon', href: '/automation', icon: Zap },
  { name: 'Ayarlar', href: '/settings', icon: SettingsIcon },
]

const Sidebar: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)

  const handleLogout = async () => {
    await dispatch(logoutUser() as any)
    navigate('/login')
  }

  // Filter navigation based on user role permissions
  const filteredNavigation = navigation.filter(item => {
    // Dashboard should always be visible to authenticated users
    if (item.href === '/dashboard') return true
    
    if (!user?.role?.permissions) return true
    
    const routePermissionMap: Record<string, string> = {
      '/customers': 'customers',
      '/products': 'products',
      '/sales': 'sales',
      '/suppliers': 'suppliers',
      '/procurement': 'procurement',
      '/finance': 'finance',
      '/tasks': 'tasks',
      '/reports': 'reports',
      '/analytics': 'reports', // Analytics uses same permissions as reports
      '/whatsapp-analytics': 'reports', // WhatsApp Analytics uses same permissions as reports
      '/automation': 'automation',
      '/settings': 'settings',
    }
    
    const requiredPermission = routePermissionMap[item.href]
    if (!requiredPermission) return true
    
    return user.role.permissions[requiredPermission]?.includes('read')
  })

  return (
    <div className="flex flex-col h-full bg-bg-sidebar text-white">
      {/* Logo and brand */}
      <div className="flex items-center px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {/* Blabmarket logo placeholder */}
            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BM</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Blabmarket</h1>
            <p className="text-xs text-gray-400">CRM Demo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* User profile and logout */}
      <div className="border-t border-gray-700 p-4">
        {user && (
          <div className="mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.role.name === 'admin' && 'Yönetici'}
                  {user.role.name === 'sales_team' && 'Satış Ekibi'}
                  {user.role.name === 'finance_team' && 'Finans Ekibi'}
                  {user.role.name === 'import_export_team' && 'İthalat/İhracat'}
                  {user.role.name === 'support_team' && 'Destek Ekibi'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogOutIcon className="mr-3 h-5 w-5 flex-shrink-0" />
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}

export default Sidebar