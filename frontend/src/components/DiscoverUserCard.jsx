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

  const getAvatarGradient = (name) => {
    const gradients = [
      'from-rose-400 to-red-500',
      'from-orange-400 to-amber-500',
      'from-emerald-400 to-teal-500',
      'from-cyan-400 to-blue-500',
      'from-indigo-400 to-purple-500',
      'from-fuchsia-400 to-pink-500',
      'from-violet-400 to-fuchsia-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const getInterestColor = (interest) => {
    const colors = [
      'bg-red-50 text-red-700 border-red-100',
      'bg-orange-50 text-orange-700 border-orange-100',
      'bg-amber-50 text-amber-700 border-amber-100',
      'bg-green-50 text-green-700 border-green-100',
      'bg-emerald-50 text-emerald-700 border-emerald-100',
      'bg-teal-50 text-teal-700 border-teal-100',
      'bg-cyan-50 text-cyan-700 border-cyan-100',
      'bg-blue-50 text-blue-700 border-blue-100',
      'bg-indigo-50 text-indigo-700 border-indigo-100',
      'bg-violet-50 text-violet-700 border-violet-100',
      'bg-purple-50 text-purple-700 border-purple-100',
      'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
      'bg-pink-50 text-pink-700 border-pink-100',
      'bg-rose-50 text-rose-700 border-rose-100'
    ];
    let hash = 0;
    for (let i = 0; i < interest.length; i++) {
      hash = interest.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

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
    <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">{user.name}</h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5 mb-1">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium mr-0.5 flex items-center gap-1">🎯 Learning:</span>
              {user.languagesLearning && user.languagesLearning.length > 0 ? (
                user.languagesLearning.slice(0, 3).map((lang) => (
                  <span key={lang} className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-400">Not specified</span>
              )}
              {user.languagesLearning && user.languagesLearning.length > 3 && (
                <span className="text-[10px] sm:text-[11px] text-slate-500 px-1 font-medium">
                  +{user.languagesLearning.length - 3}
                </span>
              )}
            </div>
          </div>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getAvatarGradient(user.name)} rounded-2xl rotate-3 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0 shadow-md group-hover:-rotate-6 transition-transform duration-300`}>
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
                className={`text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium border ${getInterestColor(interest)} transition-colors duration-300`}
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
    </div>
  )
}
