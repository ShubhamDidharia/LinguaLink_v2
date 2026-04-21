import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUser, getMe } from '../services/api'

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
      } catch (err) {
        console.error('Failed to load user:', err)
        setError('User not found')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId])

  if (isLoading) {
    return (
      <div className="container">
        <div className="center-card card">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container">
        <div className="header">
          <div className="app-title">LinguaLink</div>
          <button 
            className="secondary" 
            onClick={() => navigate(-1)}
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            Back
          </button>
        </div>
        <div className="center-card card">
          <p style={{ color: '#d32f2f' }}>{error || 'User not found'}</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '12px' }}>
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser && currentUser._id === user._id

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="app-title">LinguaLink</div>
        <button 
          className="secondary" 
          onClick={() => navigate(-1)}
          style={{ padding: '6px 12px', fontSize: '13px' }}
        >
          Back
        </button>
      </div>

      {/* Profile Card */}
      <div style={{
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 12px 0' }}>{user.name}</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            {user.bio && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Bio</h4>
                <p style={{ margin: '0', fontSize: '13px', color: '#555', lineHeight: '1.5' }}>
                  {user.bio}
                </p>
              </div>
            )}

            {user.interests && user.interests.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Interests</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {user.interests.map(interest => (
                    <span 
                      key={interest} 
                      style={{ 
                        background: '#e3f2fd', 
                        color: '#1976d2',
                        padding: '4px 10px', 
                        borderRadius: '16px', 
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.languagesKnown && user.languagesKnown.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Languages Known</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {user.languagesKnown.map(lang => (
                    <span 
                      key={lang} 
                      style={{ 
                        background: '#f3e5f5', 
                        color: '#7b1fa2',
                        padding: '4px 10px', 
                        borderRadius: '16px', 
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.languagesLearning && user.languagesLearning.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Learning Languages</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {user.languagesLearning.map(lang => (
                    <span 
                      key={lang} 
                      style={{ 
                        background: '#e8f5e9', 
                        color: '#388e3c',
                        padding: '4px 10px', 
                        borderRadius: '16px', 
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.subscription && (
              <div style={{
                marginTop: '16px',
                padding: '8px 12px',
                backgroundColor: '#fff3e0',
                border: '1px solid #ffb74d',
                borderRadius: '4px'
              }}>
                <span style={{ fontSize: '12px', color: '#e65100' }}>✓ Premium Member</span>
              </div>
            )}
          </div>

          <div style={{ marginLeft: '20px' }}>
            {!isOwnProfile && (
              <button 
                className="primary"
                onClick={() => {
                  // You can add messaging/connect functionality here later
                  alert(`Connect with ${user.name} feature coming soon!`)
                }}
                style={{ padding: '8px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
