import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, UserCheck, Clock, MessageCircle } from 'lucide-react'
import { sendConnectionRequest, getConnectionStatus } from '../services/api'
import { showSuccess, showError } from '../utils/toast'

export default function DiscoverUserCard({ user, currentUser, onConnectionChange }) {
  const navigate = useNavigate()
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentUser || currentUser._id === user._id) return

    async function checkStatus() {
      try {
        const status = await getConnectionStatus(user._id)
        setConnectionStatus(status)
      } catch (err) {
        console.error('Failed to check connection status:', err)
      }
    }

    checkStatus()
  }, [user._id, currentUser])

  const handleConnect = async () => {
    try {
      setLoading(true)
      await sendConnectionRequest(user._id)
      const status = await getConnectionStatus(user._id)
      setConnectionStatus(status)
      showSuccess('Connection request sent! 🤝')
      onConnectionChange?.()
    } catch (err) {
      console.error('Failed to send connection request:', err)
      showError(err.error || 'Failed to send connection request')
      setConnectionStatus({ status: 'pending' })
    } finally {
      setLoading(false)
    }
  }

  const getButtonContent = () => {
    if (!connectionStatus) {
      return (
        <>
          <UserPlus size={18} />
          <span>Connect</span>
        </>
      )
    }

    switch (connectionStatus.status) {
      case 'pending':
        return (
          <>
            <Clock size={18} />
            <span>Pending</span>
          </>
        )
      case 'accepted':
        return (
          <>
            <UserCheck size={18} />
            <span>Connected</span>
          </>
        )
      default:
        return (
          <>
            <UserPlus size={18} />
            <span>Connect</span>
          </>
        )
    }
  }

  return (
    <div className="card hover:shadow-soft-lg transition-shadow">
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 truncate">{user.name}</h3>
          <p className="text-xs sm:text-sm text-indigo-600 font-medium truncate">
            Learning: {user.languagesLearning?.join(', ') || 'Not specified'}
          </p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {user.bio && (
        <p className="text-xs sm:text-sm text-slate-600 mb-3 line-clamp-2">{user.bio}</p>
      )}

      {user.interests && user.interests.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {user.interests.slice(0, 4).map((interest) => (
              <span
                key={interest}
                className="text-xs bg-indigo-50 text-indigo-700 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium"
              >
                {interest}
              </span>
            ))}
            {user.interests.length > 4 && (
              <span className="text-xs text-slate-600 px-2">
                +{user.interests.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => navigate(`/profile/${user._id}`)}
          className="flex-1 btn-secondary text-xs sm:text-sm"
        >
          View Profile
        </button>
        {currentUser && currentUser._id !== user._id && (
          <>
            {connectionStatus?.status === 'accepted' ? (
              <button
                onClick={() => navigate(`/chat/${user._id}`)}
                className="flex-1 btn-primary text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <MessageCircle size={16} className="sm:w-4 sm:h-4" />
                <span>Chat</span>
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading || connectionStatus?.status === 'pending'}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium py-2 rounded-lg transition-colors ${
                  connectionStatus?.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 cursor-default'
                    : 'btn-primary'
                }`}
              >
                {getButtonContent()}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
