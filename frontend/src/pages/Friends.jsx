import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, getAcceptedConnections } from '../services/api'
import MainLayout from '../components/MainLayout'
import { Users, MessageCircle } from 'lucide-react'

export default function Friends() {
  const [friends, setFriends] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getMe()
        setCurrentUser(user)

        const connections = await getAcceptedConnections()
        setFriends(connections)
      } catch (err) {
        console.error('Failed to load data:', err)
        navigate('/login', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [navigate])

  return (
    <MainLayout currentUser={currentUser} isLoading={isLoading}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-indigo-600" size={28} />
            <h1 className="text-4xl font-bold text-slate-900">Friends</h1>
          </div>
          <p className="text-slate-600 text-lg">
            {friends.length} connected {friends.length === 1 ? 'friend' : 'friends'}
          </p>
        </div>

        {/* Friends List */}
        {friends.length === 0 ? (
          <div className="text-center py-16 card bg-slate-50 border-dashed">
            <div className="text-6xl mb-4">👋</div>
            <p className="text-xl text-slate-600 mb-2">No friends yet</p>
            <p className="text-slate-500 mb-6">Start connecting with other language learners</p>
            <button
              onClick={() => navigate('/discover')}
              className="btn-primary inline-block"
            >
              Find Language Partners
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map(friend => (
              <div key={friend._id} className="card hover:shadow-soft-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {friend.name}
                    </h3>
                    <p className="text-sm text-slate-600">{friend.email}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {friend.bio && (
                  <p className="text-sm text-slate-600 mb-3">{friend.bio}</p>
                )}

                {friend.languagesKnown && friend.languagesKnown.length > 0 && (
                  <p className="text-sm text-slate-700 mb-3">
                    <strong>Knows:</strong> {friend.languagesKnown.join(', ')}
                  </p>
                )}

                {friend.languagesLearning && friend.languagesLearning.length > 0 && (
                  <p className="text-sm text-slate-700 mb-4">
                    <strong>Learning:</strong> {friend.languagesLearning.join(', ')}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/profile/${friend._id}`)}
                    className="flex-1 btn-secondary text-sm"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate(`/chat/${friend._id}`)}
                    className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Chat
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
