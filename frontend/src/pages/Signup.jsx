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
      if (user?.token) {
        localStorage.setItem('authToken', user.token)
      }
      localStorage.setItem('user', JSON.stringify(user))
      showSuccess('Welcome to DuoClick! 🎉 Your account has been created.')
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-purple-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className={`w-full transition-all duration-500 ${step === 2 ? 'max-w-md lg:max-w-2xl' : 'max-w-md'}`}>
        {/* Logo & Header */}
        <button
          onClick={() => navigate('/')}
          className="w-full text-center mb-6 sm:mb-8 hover:opacity-80 transition-opacity"
        >
          <div className="inline-block">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg">
              <span className="text-white text-xl sm:text-2xl font-bold">D</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">DuoClick</h1>
          <p className="text-sm sm:text-base text-slate-600">Join our language learning community</p>
        </button>

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
        <div className="bg-white/85 rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200/50 min-h-96">
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableInterests.map(interest => {
                      const isSelected = interests.includes(interest);
                      const colors = [
                        { unselected: 'bg-red-50 text-red-700 border-red-200 hover:border-red-300 hover:bg-red-100', selected: 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/30' },
                        { unselected: 'bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-300 hover:bg-orange-100', selected: 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/30' },
                        { unselected: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300 hover:bg-amber-100', selected: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30' },
                        { unselected: 'bg-green-50 text-green-700 border-green-200 hover:border-green-300 hover:bg-green-100', selected: 'bg-green-500 text-white border-green-500 shadow-md shadow-green-500/30' },
                        { unselected: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100', selected: 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/30' },
                        { unselected: 'bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-300 hover:bg-teal-100', selected: 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/30' },
                        { unselected: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:border-cyan-300 hover:bg-cyan-100', selected: 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/30' },
                        { unselected: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-100', selected: 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/30' },
                        { unselected: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-100', selected: 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/30' },
                        { unselected: 'bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-300 hover:bg-violet-100', selected: 'bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-500/30' },
                        { unselected: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300 hover:bg-purple-100', selected: 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/30' },
                        { unselected: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:border-fuchsia-300 hover:bg-fuchsia-100', selected: 'bg-fuchsia-500 text-white border-fuchsia-500 shadow-md shadow-fuchsia-500/30' },
                        { unselected: 'bg-pink-50 text-pink-700 border-pink-200 hover:border-pink-300 hover:bg-pink-100', selected: 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/30' },
                        { unselected: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300 hover:bg-rose-100', selected: 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/30' }
                      ];
                      let hash = 0;
                      for (let i = 0; i < interest.length; i++) {
                        hash = interest.charCodeAt(i) + ((hash << 5) - hash);
                      }
                      const c = colors[Math.abs(hash) % colors.length];

                      return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`
                          px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 border-2 transform hover:scale-105 active:scale-95
                          ${isSelected ? c.selected : c.unselected}
                        `}
                      >
                        {interest}
                      </button>
                    )})}
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
                  options={LANGUAGES.filter(l => !languagesLearning.includes(l))}
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
                  options={LANGUAGES.filter(l => !languagesKnown.includes(l))}
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
