import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
