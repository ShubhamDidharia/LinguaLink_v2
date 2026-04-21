import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      
      // Store user in localStorage (cookie is set by server automatically)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Clear form
      setEmail('')
      setPassword('')
      
      // Navigate to home
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err?.error || err?.message || 'Login failed. Please try again.'
      setError(msg)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="center-card card">
        <div className="header">
          <div className="app-title">LinguaLink</div>
        </div>
        <h2>Login</h2>

        {error && (
          <div style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#ffe0e0',
            color: '#d32f2f',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => navigate('/signup')}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Demo:</strong> alice.smith@example.com / Password123!
        </div>
      </div>
    </div>
  )
}
