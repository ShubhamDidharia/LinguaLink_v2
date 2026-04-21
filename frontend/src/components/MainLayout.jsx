import React from 'react'
import Sidebar from './Sidebar'

export default function MainLayout({ children, currentUser, isLoading }) {
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
      <Sidebar currentUser={currentUser} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
