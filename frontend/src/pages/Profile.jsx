import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUser, getMe, sendConnectionRequest, getConnectionStatus } from '../services/api'
import MainLayout from '../components/MainLayout'
import { ArrowLeft, MessageCircle, UserPlus } from 'lucide-react'

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        // Try to get current user
        try {
          const me = await getMe()
          setCurrentUser(me)
        } catch (err) {
          // Not logged in, that's okay
        }

        // Fetch the profile user
        const profileUser = await getUser(userId)
        setUser(profileUser)

        // Check connection status if logged in
        if (currentUser && currentUser._id !== userId) {
          try {
            const status = await getConnectionStatus(userId)
            setConnectionStatus(status)
          } catch (err) {
            console.error('Failed to check connection status')
          }
        }
      } catch (err) {
        console.error('Failed to load user:', err)
        setError('User not found')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId])

  const isOwnProfile = currentUser && currentUser._id === user?._id

  const handleConnect = async () => {
    try {
      setConnecting(true)
      await sendConnectionRequest(userId)
      const status = await getConnectionStatus(userId)
      setConnectionStatus(status)
    } catch (err) {
      console.error('Failed to connect:', err)
      // Show success message since the request was likely created
      alert('Connection request sent! Check your notifications.')
      setConnectionStatus({ status: 'pending' })
    } finally {
      setConnecting(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout currentUser={currentUser} isLoading={true} />
    )
  }

  if (error || !user) {
    return (
      <MainLayout currentUser={currentUser}>
        <div className="p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
          <div className="card bg-red-50 border border-red-200 text-center py-16">
            <p className="text-xl text-red-700 font-medium">{error || 'User not found'}</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout currentUser={currentUser}>
      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>

        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                  <p className="text-slate-600">{user.email}</p>
                </div>
              </div>
            </div>

            {!isOwnProfile && currentUser && (
              <div className="flex gap-2">
                <button
                  onClick={handleConnect}
                  disabled={connecting || connectionStatus?.status === 'accepted'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    connectionStatus?.status === 'accepted'
                      ? 'bg-green-50 text-green-700 cursor-default'
                      : 'btn-primary'
                  }`}
                >
                  <UserPlus size={18} />
                  {connectionStatus?.status === 'accepted' ? 'Connected' : 'Connect'}
                </button>
                {connectionStatus?.status === 'accepted' && (
                  <button
                    onClick={() => navigate(`/chat/${user._id}`)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Chat
                  </button>
                )}
              </div>
            )}
          </div>

          {user.bio && (
            <p className="text-slate-700 leading-relaxed text-lg mb-6 pb-6 border-b border-slate-200">
              {user.bio}
            </p>
          )}

          {/* Language Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {user.languagesKnown && user.languagesKnown.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 uppercase mb-3 tracking-wide">
                  Languages Known
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.languagesKnown.map(lang => (
                    <span
                      key={lang}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {user.languagesLearning && user.languagesLearning.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 uppercase mb-3 tracking-wide">
                  Learning Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.languagesLearning.map(lang => (
                    <span
                      key={lang}
                      className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-600 uppercase mb-4 tracking-wide">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map(interest => (
                <span
                  key={interest}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Premium Badge */}
        {user.subscription && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 font-medium">⭐ Premium Member</p>
            <p className="text-sm text-amber-700">This user has access to all LinguaLink Premium features</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
