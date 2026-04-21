import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getInterests, signup } from '../services/api'
import MultiSelect from '../components/MultiSelect'

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 
  'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Italian'
]

export default function Signup() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [interests, setInterests] = useState([])
  const [availableInterests, setAvailableInterests] = useState([])
  const [bio, setBio] = useState('')
  const [languagesKnown, setLanguagesKnown] = useState([])
  const [languagesLearning, setLanguagesLearning] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Load interests on mount
  useEffect(() => {
    getInterests()
      .then(setAvailableInterests)
      .catch(err => {
        console.error('Failed to load interests:', err)
        setAvailableInterests([])
      })
  }, [])

  function toggleInterest(item) {
    setInterests(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    )
  }

  async function handleFinalSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate
      if (!name.trim() || !email.trim() || !password.trim()) {
        throw new Error('Name, email, and password are required')
      }
      if (interests.length < 2) {
        throw new Error('Select at least 2 interests')
      }
      if (languagesKnown.length === 0 || languagesLearning.length === 0) {
        throw new Error('Select at least one language you know and one you want to learn')
      }

      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        bio: bio.trim(),
        interests,
        languagesKnown,
        languagesLearning,
        subscription: false
      }

      const user = await signup(payload)
      
      // Store user in localStorage (cookie is set by server automatically)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Navigate to home
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err?.error || err?.message || 'Signup failed. Please try again.'
      setError(msg)
      console.error('Signup error:', err)
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
        <h2>Sign Up</h2>

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

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <form onSubmit={e => { e.preventDefault(); setStep(2) }}>
            <div className="form-row">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

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
              <button type="submit">Next: Interests</button>
              <button
                type="button"
                className="secondary"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>
              Choose Your Interests (minimum 2)
            </h3>

            {availableInterests.length === 0 ? (
              <p style={{ color: '#666' }}>Loading interests...</p>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  {availableInterests.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`interest-btn ${interests.includes(interest) ? 'active' : ''}`}
                      style={{
                        padding: '10px',
                        borderRadius: '4px',
                        border: '2px solid #ddd',
                        backgroundColor: interests.includes(interest) ? '#007bff' : '#f5f5f5',
                        color: interests.includes(interest) ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {interest}
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                  Selected: {interests.length}/2+ interests
                </p>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="secondary"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (interests.length < 2) {
                        setError('Select at least 2 interests')
                        return
                      }
                      setError('')
                      setStep(3)
                    }}
                  >
                    Next: Languages & Bio
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Languages & Bio */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit}>
            <div className="form-row">
              <label>Bio (optional)</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="form-row">
              <label>Languages You Know *</label>
              <MultiSelect
                options={LANGUAGES}
                selected={languagesKnown}
                onChange={setLanguagesKnown}
                placeholder="Select languages you speak"
              />
            </div>

            <div className="form-row">
              <label>Languages You Want to Learn *</label>
              <MultiSelect
                options={LANGUAGES}
                selected={languagesLearning}
                onChange={setLanguagesLearning}
                placeholder="Select languages to learn"
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="secondary"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || languagesKnown.length === 0 || languagesLearning.length === 0}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
