import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectIsAuthenticated, selectUser } from './store/slices/authSlice'
import { webSocketService } from './utils/websocketService'
import LoginPage from './modules/auth/LoginPage'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './modules/dashboard/Dashboard'
import CustomersPage from './modules/customers/CustomersPage'
import ProductsPage from './modules/products/ProductsPage'
import SalesPage from './modules/sales/SalesPage'
import SuppliersPage from './modules/suppliers/SuppliersPage'
import FinancePage from './modules/finance/FinancePage'
import TasksPage from './modules/tasks/TasksPage'
import AutomationPage from './modules/automation/AutomationPage'
import ProfilePage from './modules/profile/ProfilePage'
import ReportsPage from './modules/reports/ReportsPage'
import AnalyticsPage from './modules/reports/AnalyticsPage'
import WhatsAppAnalyticsPage from './modules/whatsapp/WhatsAppAnalyticsPage'
import SettingsPage from './modules/settings/SettingsPage'
import NotificationsPage from './modules/notifications/NotificationsPage'
import PDFTestPage from './PDFTestPage'

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Public Route component (only for unauthenticated users)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

const App: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)

  // Handle WebSocket connection based on auth status
  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect WebSocket when user is authenticated
      webSocketService.connect(user.id, `${user.firstName} ${user.lastName}`)
    } else {
      // Disconnect WebSocket when user logs out
      webSocketService.disconnect()
    }

    return () => {
      // Cleanup on unmount
      webSocketService.disconnect()
    }
  }, [isAuthenticated, user])

  return (
    <div className="min-h-screen bg-bg-primary">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        
        {/* PDF Test Route - Public for testing */}
        <Route path="/pdf-test" element={<PDFTestPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customers/*" element={<CustomersPage />} />
                  <Route path="/products/*" element={<ProductsPage />} />
                  <Route path="/sales/*" element={<SalesPage />} />
                  <Route path="/suppliers/*" element={<SuppliersPage />} />
                  <Route path="/finance/*" element={<FinancePage />} />
                  <Route path="/procurement" element={<div className="p-6">Satın Alma Modülü - Yakında</div>} />
                  <Route path="/tasks/*" element={<TasksPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/whatsapp-analytics" element={<WhatsAppAnalyticsPage />} />
                  <Route path="/automation" element={<AutomationPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App