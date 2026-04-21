import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

export default function MainLayout({ children, currentUser, isLoading }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block w-64 fixed h-screen z-40">
        <Sidebar currentUser={currentUser} mobileOpen={false} onCloseMobile={() => {}} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 bg-white z-40 transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar currentUser={currentUser} mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto lg:ml-64 w-full">
        {/* Mobile header with hamburger */}
        <div className="sticky top-0 bg-white border-b border-slate-200 lg:hidden z-20">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-slate-900" />
              ) : (
                <Menu size={24} className="text-slate-900" />
              )}
            </button>
            <div className="text-lg font-bold text-indigo-600">LinguaLink</div>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
