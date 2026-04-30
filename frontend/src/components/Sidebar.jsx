import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, User, Home, Users, MessageCircle, Briefcase, Bell, CreditCard } from 'lucide-react'

export default function Sidebar({ currentUser, mobileOpen, onCloseMobile }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      onCloseMobile?.()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const handleNavigate = (path) => {
    navigate(path)
    onCloseMobile?.()
  }

  const menuItems = [
    { icon: Home, label: 'Discover', path: '/discover' },
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: Briefcase, label: 'Workspace', path: '/workspace' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: CreditCard, label: 'Billing', path: '/billing' },
  ]

  return (
    <div className="w-full bg-white border-r border-slate-200 h-screen flex flex-col p-4 sm:p-6 shadow-soft">
      {/* Logo - Hidden on mobile since header shows it */}
      <div
        onClick={() => handleNavigate('/discover')}
        className="hidden sm:block text-2xl font-bold text-indigo-600 mb-8 cursor-pointer hover:text-indigo-700 transition-colors"
      >
        DuoClick
      </div>

      {/* Logo Mobile - Smaller version */}
      <div
        onClick={() => handleNavigate('/discover')}
        className="sm:hidden text-xl font-bold text-indigo-600 mb-6 cursor-pointer hover:text-indigo-700 transition-colors text-center"
      >
        LL
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span className="hidden sm:inline">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-slate-200 pt-4 space-y-2">
        {currentUser && (
          <div
            onClick={() => handleNavigate(`/profile/${currentUser._id}`)}
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-1 min-w-0 flex-col">
              <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-600 truncate">{currentUser.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center sm:justify-start gap-3 px-3 sm:px-4 py-2 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  )
}
