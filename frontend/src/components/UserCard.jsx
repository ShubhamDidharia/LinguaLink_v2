import React from 'react'

export default function UserCard({ user }) {
  return (
    <div className="card user-card">
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
