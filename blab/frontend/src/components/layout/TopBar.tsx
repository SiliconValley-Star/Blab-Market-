import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { MenuIcon, SearchIcon, BellIcon, UserIcon, SettingsIcon, LogOutIcon, WifiIcon, SendIcon } from 'lucide-react'

import { toggleSidebar, selectNotifications, markNotificationAsRead } from '../../store/slices/uiSlice'
import { selectUser, logoutUser } from '../../store/slices/authSlice'
import { selectUnreadNotificationsCount } from '../../store/slices/uiSlice'
import { useAppDispatch } from '../../hooks/redux'
import { webSocketService } from '../../utils/websocketService'

const TopBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const notifications = useSelector(selectNotifications)
  const unreadCount = useSelector(selectUnreadNotificationsCount)
  
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotificationSender, setShowNotificationSender] = useState(false)
  const [websocketConnected, setWebsocketConnected] = useState(false)
  
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const senderRef = useRef<HTMLDivElement>(null)

  // Check WebSocket connection status
  useEffect(() => {
    const checkConnection = setInterval(() => {
      setWebsocketConnected(webSocketService.isConnected())
    }, 1000)

    return () => clearInterval(checkConnection)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
      if (senderRef.current && !senderRef.current.contains(event.target as Node)) {
        setShowNotificationSender(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const formatNotificationTime = (timestamp: string) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Şimdi'
    if (diffInMinutes < 60) return `${diffInMinutes} dk önce`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} sa önce`
    return `${Math.floor(diffInMinutes / 1440)} gün önce`
  }

  const handleNotificationClick = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId))
  }

  const handleSendBroadcastNotification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const message = formData.get('message') as string
    const type = formData.get('type') as 'success' | 'error' | 'warning' | 'info'

    if (title && message) {
      webSocketService.sendNotification({
        type,
        title,
        message
      })
      
      setShowNotificationSender(false)
      // Reset form
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <MenuIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          {/* Page title - Clickable to go to Dashboard */}
          <div>
            <Link
              to="/dashboard"
              className="text-xl font-semibold text-gray-900 hover:text-primary-blue transition-colors cursor-pointer"
            >
              Blabmarket CRM
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ara..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* WebSocket Status */}
          <div className="flex items-center">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              websocketConnected
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              <WifiIcon className="h-3 w-3" />
              <span>{websocketConnected ? 'Bağlı' : 'Bağlantısız'}</span>
            </div>
          </div>

          {/* Send Notification */}
          {websocketConnected && (
            <div className="relative" ref={senderRef}>
              <button
                onClick={() => setShowNotificationSender(!showNotificationSender)}
                className="p-2 rounded-md hover:bg-gray-100 text-primary-blue"
                title="Kullanıcılara bildirim gönder"
              >
                <SendIcon className="h-5 w-5" />
              </button>

              {/* Notification Sender Modal */}
              {showNotificationSender && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Bildirim Gönder</h3>
                  </div>
                  <form onSubmit={handleSendBroadcastNotification} className="p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                      <select name="type" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="info">Bilgi</option>
                        <option value="success">Başarı</option>
                        <option value="warning">Uyarı</option>
                        <option value="error">Hata</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Bildirim başlığı"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                      <textarea
                        name="message"
                        required
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Bildirim mesajı"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex-1 bg-primary-blue text-white py-2 px-4 rounded-md text-sm hover:bg-blue-600"
                      >
                        Gönder
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNotificationSender(false)}
                        className="flex-1 border border-gray-300 py-2 px-4 rounded-md text-sm hover:bg-gray-50"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md hover:bg-gray-100"
            >
              <BellIcon className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-red text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              {notification.type === 'success' && (
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              )}
                              {notification.type === 'error' && (
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              )}
                              {notification.type === 'warning' && (
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                              )}
                              {notification.type === 'info' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              )}
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{formatNotificationTime(notification.timestamp)}</p>
                              </div>
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <BellIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Henüz bildirim bulunmuyor</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      navigate('/notifications')
                      setShowNotifications(false)
                    }}
                    className="text-sm text-primary-blue hover:text-blue-600 font-medium"
                  >
                    Tüm bildirimleri görüntüle
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.role.name === 'admin' && 'Yönetici'}
                    {user.role.name === 'sales_team' && 'Satış Ekibi'}
                    {user.role.name === 'finance_team' && 'Finans Ekibi'}
                    {user.role.name === 'import_export_team' && 'İthalat/İhracat'}
                    {user.role.name === 'support_team' && 'Destek Ekibi'}
                  </p>
                </div>
                <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setShowProfileMenu(false)
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon className="h-4 w-4 mr-3" />
                      Profil
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/settings')
                        setShowProfileMenu(false)
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <SettingsIcon className="h-4 w-4 mr-3" />
                      Ayarlar
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOutIcon className="h-4 w-4 mr-3" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar