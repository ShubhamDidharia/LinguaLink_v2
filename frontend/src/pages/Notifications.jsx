import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, getPendingConnections, respondToConnectionRequest } from '../services/api'
import MainLayout from '../components/MainLayout'
import { Bell, Check, X } from 'lucide-react'

export default function Notifications() {
  const [currentUser, setCurrentUser] = useState(null)
  const [pendingConnections, setPendingConnections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getMe()
        setCurrentUser(user)

        const pending = await getPendingConnections()
        setPendingConnections(pending)
      } catch (err) {
        navigate('/login', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [navigate])

  const handleRespond = async (connectionId, action) => {
    try {
      await respondToConnectionRequest(connectionId, action)
      setPendingConnections(pending =>
        pending.filter(p => p._id !== connectionId)
      )
    } catch (err) {
      console.error('Failed to respond:', err)
      alert('Failed to respond to connection request')
    }
  }

  return (
    <MainLayout currentUser={currentUser} isLoading={isLoading}>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="text-indigo-600" size={28} />
          <h1 className="text-4xl font-bold text-slate-900">Notifications</h1>
        </div>

        {pendingConnections.length === 0 ? (
          <div className="card bg-slate-50 border-dashed">
            <div className="text-center py-16">
              <Bell size={48} className="mx-auto mb-4 text-slate-400" />
              <p className="text-xl text-slate-600 mb-2">No pending requests</p>
              <p className="text-slate-500">You're all caught up!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingConnections.map(conn => (
              <div key={conn._id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {conn.sender.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{conn.sender.name}</p>
                    <p className="text-sm text-slate-600">{conn.sender.email}</p>
                    {conn.sender.bio && (
                      <p className="text-sm text-slate-600 mt-1">{conn.sender.bio}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/profile/${conn.sender._id}`)}
                    className="btn-secondary text-sm"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleRespond(conn._id, 'accept')}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    <Check size={16} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(conn._id, 'reject')}
                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium text-sm"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
