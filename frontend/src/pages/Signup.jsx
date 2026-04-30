import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getInterests, signup } from '../services/api'
import { showSuccess, showError } from '../utils/toast'
import MultiSelect from '../components/MultiSelect'
import { User, Mail, Lock, Heart, Globe, ChevronRight, ChevronLeft } from 'lucide-react'

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
      localStorage.setItem('user', JSON.stringify(user))
      showSuccess('Welcome to LinguaLink! 🎉 Your account has been created.')
      navigate('/discover', { replace: true })
    } catch (err) {
      const msg = err?.error || err?.message || 'Signup failed. Please try again.'
      setError(msg)
      showError(msg)
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg">
              <span className="text-white text-xl sm:text-2xl font-bold">L</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">LinguaLink</h1>
          <p className="text-sm sm:text-base text-slate-600">Join our language learning community</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-2 sm:px-0">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center flex-1">
              <div className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all
                ${s === step 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : s < step 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-200 text-slate-600'}
              `}>
                {s < step ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-1 sm:mx-2 transition-all ${
                  s < step ? 'bg-green-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-soft-lg p-6 sm:p-8 border border-slate-200 min-h-96">
          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
              <div className="text-red-600 mt-0.5 flex-shrink-0">⚠️</div>
              <p className="text-xs sm:text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <form onSubmit={e => { e.preventDefault(); setStep(2) }} className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Your Account</h2>

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="input-field pl-10 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-field pl-10 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-field pl-10 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Minimum 6 characters</p>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex-1 btn-secondary"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Interests */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Heart className="text-red-500" size={24} />
                  Choose Your Interests
                </h2>
                <p className="text-sm text-slate-600">Select at least 2 interests that match your passions</p>
              </div>

              {availableInterests.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Loading interests...</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {availableInterests.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`
                          px-4 py-3 rounded-lg font-medium text-sm transition-all border-2
                          ${interests.includes(interest)
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'}
                        `}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <p className={`text-sm font-medium ${
                      interests.length >= 2 ? 'text-green-600' : 'text-slate-600'
                    }`}>
                      {interests.length} / 2+ selected {interests.length >= 2 && '✓'}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={18} /> Back
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
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: Languages & Bio */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Globe className="text-blue-500" size={24} />
                  Languages & Bio
                </h2>
                <p className="text-sm text-slate-600">Tell us about your languages and yourself</p>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">
                  About You (optional)
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us something interesting about yourself..."
                  rows={3}
                  className="input-field resize-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-500 mt-2">{bio.length}/500 characters</p>
              </div>

              {/* Languages Known */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Languages You Speak <span className="text-red-500">*</span>
                </label>
                <MultiSelect
                  options={LANGUAGES}
                  selected={languagesKnown}
                  onChange={setLanguagesKnown}
                  placeholder="Select languages you speak"
                />
              </div>

              {/* Languages Learning */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Languages You Want to Learn <span className="text-red-500">*</span>
                </label>
                <MultiSelect
                  options={LANGUAGES}
                  selected={languagesLearning}
                  onChange={setLanguagesLearning}
                  placeholder="Select languages to learn"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-slate-600 cursor-pointer">
                    I agree to the Terms of Service
                  </label>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading || languagesKnown.length === 0 || languagesLearning.length === 0}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
