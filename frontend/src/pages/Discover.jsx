import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, getUsers } from '../services/api'
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

        // Compute matches
        const meInterests = user.interests || []
        const meKnown = user.languagesKnown || []
        const meLearning = user.languagesLearning || []

        const matched = allUsers.filter(u => {
          if (!u || !u._id || u._id === user._id) return false
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
      <div className="p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-indigo-600" size={28} />
            <h1 className="text-4xl font-bold text-slate-900">Discover</h1>
          </div>
          <p className="text-slate-600 text-lg">
            {currentUser
              ? 'Meet fellow language learners who match your interests and language goals'
              : 'Connect with language learners around the world'}
          </p>
        </div>

        {/* User Grid */}
        {displayUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-xl text-slate-600 mb-2">No matches found yet</p>
            <p className="text-slate-500">Complete your profile to find better matches</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
