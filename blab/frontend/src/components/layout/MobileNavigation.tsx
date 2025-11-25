import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  HomeIcon, 
  UsersIcon, 
  PackageIcon, 
  TrendingUpIcon, 
  ShoppingCartIcon, 
  CreditCardIcon, 
  CheckSquareIcon, 
  BarChart3Icon, 
  Zap,
  SettingsIcon
} from 'lucide-react'
import { selectUser } from '../../store/slices/authSlice'

const navigation = [
  { name: 'Ana Sayfa', href: '/dashboard', icon: HomeIcon, shortName: 'Ana' },
  { name: 'Müşteriler', href: '/customers', icon: UsersIcon, shortName: 'Müşteri' },
  { name: 'Ürünler', href: '/products', icon: PackageIcon, shortName: 'Ürün' },
  { name: 'Satış', href: '/sales', icon: TrendingUpIcon, shortName: 'Satış' },
  { name: 'Finans', href: '/finance', icon: CreditCardIcon, shortName: 'Finans' },
  { name: 'Görevler', href: '/tasks', icon: CheckSquareIcon, shortName: 'Görev' },
  { name: 'Raporlar', href: '/reports', icon: BarChart3Icon, shortName: 'Rapor' },
  { name: 'Otomasyon', href: '/automation', icon: Zap, shortName: 'Oto' }
]

const MobileNavigation: React.FC = () => {
  const user = useSelector(selectUser)

  // Filter navigation based on user role permissions
  const filteredNavigation = navigation.filter(item => {
    if (!user?.role?.permissions) return true
    
    const routePermissionMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/customers': 'customers',
      '/products': 'products',
      '/sales': 'sales',
      '/procurement': 'procurement',
      '/finance': 'finance',
      '/tasks': 'tasks',
      '/reports': 'reports',
      '/automation': 'automation',
      '/settings': 'settings',
    }
    
    const requiredPermission = routePermissionMap[item.href]
    if (!requiredPermission) return true
    
    return user.role.permissions[requiredPermission]?.includes('read')
  })

  // Show only first 5 items in mobile nav to prevent overcrowding
  const mobileNavItems = filteredNavigation.slice(0, 5)

  return (
    <div className="nav-mobile">
      {mobileNavItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `nav-mobile-item ${
                isActive
                  ? 'text-primary-blue'
                  : 'text-gray-600 hover:text-primary-blue'
              }`
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.shortName}</span>
          </NavLink>
        )
      })}
      
      {/* More menu for additional items */}
      {filteredNavigation.length > 5 && (
        <NavLink
          to="/settings"
          className="nav-mobile-item"
        >
          <SettingsIcon className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Daha</span>
        </NavLink>
      )}
    </div>
  )
}

export default MobileNavigation