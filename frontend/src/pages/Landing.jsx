import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Globe, Users, MessageCircle, BookOpen } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-purple-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/60 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              DuoClick
            </span>
          </button>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-7 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-full hover:from-yellow-500 hover:to-yellow-600 font-semibold transition-all shadow-lg hover:shadow-xl hover:shadow-yellow-400/40"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 z-10">
              <h1
                className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Language Mastery,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
                  Powered by Connection
                </span>
              </h1>

              <p className="text-lg text-slate-700 leading-relaxed max-w-lg" style={{ fontFamily: "'Lato', sans-serif" }}>
                DuoClick connects you with a global community to practice naturally. Build genuine connections through live chat, enhanced by a context-aware AI dictionary for seamless, nuanced translation. Curate your personal vocabulary workspaces. <strong>Start for Free.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Free Today
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3.5 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 font-semibold transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Right Visual - Hero Illustration */}
            <div className="relative h-96 lg:h-full lg:min-h-screen flex items-center justify-center">
              {/* Background decorative blobs */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 right-0 w-96 h-96 bg-yellow-200/10 rounded-full blur-3xl"></div>
              </div>

              {/* Main composition with panels */}
              <div className="relative w-full h-full max-w-md lg:max-w-none space-y-4 lg:space-y-0">
                {/* Top Left - Global Peer Card */}
                <div className="absolute top-0 left-0 w-72 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                      <Globe size={20} className="text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900">Global Peer</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">Conversation</p>

                  {/* Mini user cards */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full"></div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-900">Pankasois</p>
                        <p className="text-slate-600"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">Learning</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-full"></div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-900">Jaan Ya</p>
                        <p className="text-slate-600"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Known</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center - Chat Window */}
                <div className="absolute top-24 left-32 lg:left-48 w-80 bg-white/85 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-shadow">
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-500/50 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-sm">DuoClick</p>
                        <p className="text-xs text-purple-200">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-3 bg-white">
                    <div className="bg-slate-100 rounded-lg p-3 text-sm text-slate-700 max-w-xs">
                      <p className="font-semibold mb-1">Finish jowiij nama sanikilta</p>
                      <p className="text-xs text-slate-600">mätawi kai kumiata?</p>
                    </div>

                    {/* AI Dictionary Tooltip */}
                    <div className="flex justify-end mb-2">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-3 text-xs max-w-xs shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">AI Dictionary</span>
                        </div>
                        <p className="font-semibold text-slate-900 mb-1">Context meaning</p>
                        <p className="text-slate-700 text-xs leading-relaxed">
                          Complex meaning - from context of Finnish, I comprehension. Contextual meaning - breakdown and Context (treamlongs of Lhunnien).
                        </p>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="flex gap-2 mt-4">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        readOnly
                      />
                      <button className="bg-purple-600 text-white rounded-lg p-2 hover:bg-purple-700">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Top Right - User Profile Card */}
                <div className="absolute top-0 right-0 w-64 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
                  <div className="flex gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full"></div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-900">Global Peer</p>
                      <p className="text-slate-600">Tokyo</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">Learning</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Known</span>
                  </div>
                </div>

                {/* Bottom Right - Workspaces Dashboard */}
                <div className="absolute bottom-0 right-0 w-80 bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">D</span>
                    </div>
                    <h3 className="font-bold text-white">Workspaces</h3>
                    <button className="ml-auto text-purple-400 text-xs font-semibold">+ Word class</button>
                  </div>

                  <div className="space-y-3">
                    {/* Sidebar items */}
                    <div className="text-xs text-slate-400 space-y-2">
                      <p className="hover:text-slate-300">Dashboard</p>
                      <p className="hover:text-slate-300">Vocabulary</p>
                      <p className="hover:text-slate-300">Words</p>
                      <p className="hover:text-slate-300">Reviser</p>
                      <p className="hover:text-slate-300">Explore lists</p>
                      <p className="hover:text-slate-300">Settings</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-700">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-slate-400 text-xs mb-1">All words</p>
                        <p className="text-white font-bold">573</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-slate-400 text-xs mb-1">Categorization</p>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Icon - Bookmark */}
                <div className="absolute bottom-12 right-4 w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow">
                  <BookOpen size={28} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 px-4 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 - Global Peer Connect */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Global Peer Connect</h3>
              </div>

              <p className="text-slate-700 mb-6 text-sm">
                DuoClick connect to learning anliove to connect with language learners.
              </p>

              {/* User cards in card */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">Pankasois</p>
                    <p className="text-xs text-slate-600"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">Learning</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">Jaan Ya</p>
                    <p className="text-xs text-slate-600"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Known</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Context-Aware AI Chat */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-100/50 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Context-Aware AI Chat</h3>
              </div>

              <p className="text-slate-700 mb-6 text-sm">
                Integze real conversations words word bookmark.
              </p>

              {/* Mini chat preview */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 space-y-2">
                <div className="bg-slate-100 rounded-lg p-2 text-xs text-slate-700 max-w-xs">
                  Finnish jowiij nama sanikilta?
                </div>
                <div className="flex justify-end">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-2 text-xs">
                    <p className="font-semibold text-blue-900 mb-1">Context meaning</p>
                    <p className="text-blue-700 text-xs">Context breakdown</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <button
          onClick={() => navigate('/signup')}
          className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          Start for Free
          <ArrowRight size={22} />
        </button>
      </section>
    </div>
  )
}
