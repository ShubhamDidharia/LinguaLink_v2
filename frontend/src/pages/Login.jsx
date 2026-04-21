import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { Mail, Lock, LogIn } from 'lucide-react'

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
      localStorage.setItem('user', JSON.stringify(user))
      setEmail('')
      setPassword('')
      navigate('/discover', { replace: true })
    } catch (err) {
      const msg = err?.error || err?.message || 'Login failed. Please try again.'
      setError(msg)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
              <span className="text-white text-2xl font-bold">L</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">LinguaLink</h1>
          <p className="text-slate-600">Connect with language learners worldwide</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-soft-lg p-8 border border-slate-200">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <div className="text-red-600 mt-0.5">⚠️</div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome Back</h2>

            {/* Email Field */}
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
                  placeholder="a1"
                  required
                  className="input-field pl-10 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password Field */}
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-600 cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <LogIn size={20} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-xs font-medium text-indigo-900 mb-2">🧪 Demo Credentials:</p>
            <p className="text-sm text-indigo-800 font-mono">a1 / 123456</p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-8">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
