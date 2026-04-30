import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, getUsers, getAcceptedConnections } from '../services/api'
import MainLayout from '../components/MainLayout'
import DiscoverUserCard from '../components/DiscoverUserCard'
import { Sparkles } from 'lucide-react'

function intersect(a = [], b = []) {
  return a.filter(x => b.includes(x))
}

export default function Discover() {
  const [users, setUsers] = useState([])
  const [matches, setMatches] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      try {
        // Try to get current user
        const user = await getMe()
        setCurrentUser(user)

        // Fetch all users
        const allUsers = await getUsers()
        setUsers(allUsers)

        // Fetch accepted connections to filter them out
        let connectedUserIds = []
        try {
          const connections = await getAcceptedConnections()
          connectedUserIds = connections.map(conn => conn._id)
        } catch (err) {
          console.error('Failed to load connections:', err)
        }

        // Compute matches
        const meInterests = user.interests || []
        const meKnown = user.languagesKnown || []
        const meLearning = user.languagesLearning || []

        const matched = allUsers.filter(u => {
          // Exclude self
          if (!u || !u._id || u._id === user._id) return false
          // Exclude already connected users
          if (connectedUserIds.includes(u._id)) return false
          
          const commonInterests = intersect(meInterests, u.interests || [])
          const languageMatch =
            intersect(meLearning, u.languagesKnown || []).length > 0 ||
            intersect(meKnown, u.languagesLearning || []).length > 0
          return commonInterests.length > 0 && languageMatch
        })
        setMatches(matched)
      } catch (err) {
        console.error('Failed to load data:', err)
        navigate('/login', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [navigate])

  const displayUsers = currentUser ? matches : users

  return (
    <MainLayout currentUser={currentUser} isLoading={isLoading}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        {/* Header Banner */}
        <div className="mb-8 sm:mb-12 bg-gradient-to-r from-amber-100 to-purple-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/60 backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm transform -rotate-6">
                <Sparkles className="text-indigo-600 w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-800 drop-shadow-sm">
                Discover
              </h1>
            </div>
            <p className="text-indigo-900/80 font-medium text-sm sm:text-base lg:text-lg max-w-2xl mt-2">
              {currentUser
                ? 'Meet fellow language learners who match your interests and language goals. Let the journey begin!'
                : 'Connect with language learners around the world and start practicing today!'}
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/40 blur-2xl"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-indigo-400/20 blur-xl"></div>
        </div>

        {/* User Grid */}
        {displayUsers.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🌍</div>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-2">No matches found yet</p>
            <p className="text-xs sm:text-sm text-slate-500 px-4">Complete your profile to find better matches or connect with more people</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {displayUsers.map(user => (
              <DiscoverUserCard
                key={user._id}
                user={user}
                currentUser={currentUser}
                onConnectionChange={() => {
                  // Refresh data on connection change
                }}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
