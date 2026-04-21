import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserCard({ user }) {
  const navigate = useNavigate()

  return (
    <div 
      className="card user-card"
      onClick={() => navigate(`/profile/${user._id}`)}
      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.transform = ''
      }}
    >
      <h4 style={{ margin: '0 0 8px 0' }}>{user.name}</h4>
      <div style={{ fontSize: 13, color: '#555' }}>{user.bio}</div>
      <div style={{ marginTop: 8 }}>
        <strong>Interests:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
          {user.interests && user.interests.slice(0,6).map(i => (
            <span key={i} style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{i}</span>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 13 }}>
        <strong>Knows:</strong> {user.languagesKnown?.join(', ')}
      </div>
      <div style={{ marginTop: 4, fontSize: 13 }}>
        <strong>Learning:</strong> {user.languagesLearning?.join(', ')}
      </div>
    </div>
  )
}
