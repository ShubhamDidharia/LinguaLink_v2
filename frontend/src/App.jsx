import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Discover from './pages/Discover'
import Friends from './pages/Friends'
import Chat from './pages/Chat'
import Workspace from './pages/Workspace'
import Notifications from './pages/Notifications'
import Billing from './pages/Billing'
import DictionaryButton from './components/DictionaryButton'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#000',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            style: {
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            style: {
              background: '#f3f4f6',
              color: '#111827',
              border: '1px solid #d1d5db',
            },
          },
        }}
      />
      <DictionaryButton />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:friendId" element={<Chat />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/" element={<Navigate to="/discover" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
