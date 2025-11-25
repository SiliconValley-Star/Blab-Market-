import React from 'react'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileNavigation from './MobileNavigation'
import { selectSidebarOpen } from '../../store/slices/uiSlice'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const sidebarOpen = useSelector(selectSidebarOpen)

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-bg-sidebar transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar />
      </div>
      
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => {/* Toggle sidebar closed */}}
        />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 lg:ml-0">
        {/* Top bar */}
        <TopBar />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-bg-primary pb-16 sm:pb-0">
          <div className="content-padding">
            <div className="max-w-7xl mx-auto animate-fade-in">
              {children}
            </div>
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </div>
  )
}

export default MainLayout