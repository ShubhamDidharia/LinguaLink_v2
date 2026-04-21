import React, { useEffect, useState } from 'react'
import { getUsers, getMe, logout } from '../services/api'
import UserCard from '../components/UserCard'
import { useNavigate } from 'react-router-dom'

function intersect(a = [], b = []) {
  return a.filter(x => b.includes(x))
}

export default function Home() {
  const [users, setUsers] = useState([])
  const [matches, setMatches] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      try {
        // Try to get current user (will succeed if logged in)
        const user = await getMe()
        setCurrentUser(user)

        // Fetch all users
        const allUsers = await getUsers()
        setUsers(allUsers)

        // Compute matches based on interests and languages
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
        // Not logged in, just show all users
        try {
          const allUsers = await getUsers()
          setUsers(allUsers)
        } catch (err2) {
          console.error('Failed to fetch users:', err2)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  async function handleLogout() {
    try {
      await logout()
      localStorage.removeItem('user')
      setCurrentUser(null)
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const displayUsers = currentUser ? matches : users

  if (isLoading) {
    return (
      <div className="container">
        <div className="center-card card">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="app-title">LinguaLink</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {currentUser ? (
            <>
              <span style={{ fontSize: '13px', color: '#666' }}>
                {currentUser.name}
              </span>
              <button 
                className="secondary" 
                onClick={handleLogout}
                style={{ padding: '6px 12px', fontSize: '13px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button className="secondary" onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}
        </div>
      </div>

      {/* Profile Section (for logged-in users) */}
      {currentUser && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/profile/${currentUser._id}`)}>
              <h3 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>My Profile</h3>
              <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                <strong>Email:</strong> {currentUser.email}
              </p>
              {currentUser.bio && (
                <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                  <strong>Bio:</strong> {currentUser.bio}
                </p>
              )}
              {currentUser.interests && currentUser.interests.length > 0 && (
                <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                  <strong>Interests:</strong> {currentUser.interests.slice(0, 4).join(', ')}
                  {currentUser.interests.length > 4 && ` +${currentUser.interests.length - 4} more`}
                </p>
              )}
              {currentUser.languagesKnown && currentUser.languagesKnown.length > 0 && (
                <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                  <strong>Languages:</strong> {currentUser.languagesKnown.join(', ')}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
              <button 
                className="primary"
                onClick={() => navigate(`/profile/${currentUser._id}`)}
                style={{ padding: '6px 12px', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                View Profile
              </button>
              <button 
                className="secondary"
                onClick={handleLogout}
                style={{ padding: '6px 12px', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ marginTop: currentUser ? '10px' : 0 }}>
        {currentUser ? 'Recommended Users' : 'All Users'}
      </h2>
      <div className="card">
        {displayUsers.length === 0 ? (
          <div className="note">No users found yet.</div>
        ) : (
          <div className="user-grid">
            {displayUsers.map(u => (
              <UserCard key={u._id} user={u} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
