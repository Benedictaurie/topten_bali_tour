import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext";
import { 
  FiHome, 
  FiPackage, 
  FiActivity, 
  FiTruck, 
  FiUsers, 
  FiCalendar,
  FiCreditCard, 
  FiSettings,
  FiBell,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'


const BackendLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  
  const handleLogout = () => {
    logout()
    setShowLogoutConfirm(false)
    navigate('/login')
  }

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/tours', icon: FiPackage, label: 'Tour Packages' },
    { path: '/admin/activities', icon: FiActivity, label: 'Activity Packages' },
    { path: '/admin/rentals', icon: FiTruck, label: 'Rental Packages' },
    // { path: '/admin/users', icon: FiUsers, label: 'User Management' },
    // { path: '/admin/bookings', icon: FiCalendar, label: 'Booking Management' },
    // { path: '/admin/payments', icon: FiCreditCard, label: 'Payment Transactions' },
    // { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800">ADMIN PANEL</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              <FiUser size={18} />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{user?.name ?? "Admin"}</p>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center text-xs text-gray-500 hover:text-red-600 transition-colors mt-1"
                >
                  <FiLogOut size={12} className="mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Welcome back, {user?.name ?? "Admin"}!
              </h2>
              <p className="text-sm text-gray-500">
                Here's what's happening today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button className="p-2 text-gray-500 hover:text-gray-700 relative transition-colors">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    <FiUser size={16} />
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  )}
                </button>
                
                {/* Profile Dropdown Menu */}
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-xs text-blue-600 mt-1">{user?.role}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => navigate('/admin/profile')}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiUser size={16} className="mr-2" />
                      Manage Profile
                    </button>
                    <button 
                      onClick={() => setShowLogoutConfirm(true)}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiLogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default BackendLayout