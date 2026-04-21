import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUser, getMe, sendConnectionRequest, getConnectionStatus, updateProfile, deleteProfile, getInterests } from '../services/api'
import MainLayout from '../components/MainLayout'
import MultiSelect from '../components/MultiSelect'
import { ArrowLeft, MessageCircle, UserPlus, Edit2, Save, X, Trash2 } from 'lucide-react'

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 
  'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Italian'
]

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [availableInterests, setAvailableInterests] = useState([])
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    interests: [],
    languagesKnown: [],
    languagesLearning: []
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const me = await getMe().catch(() => null)
        setCurrentUser(me)

        const profileUser = await getUser(userId)
        setUser(profileUser)
        setEditData({
          name: profileUser.name,
          bio: profileUser.bio || '',
          interests: profileUser.interests || [],
          languagesKnown: profileUser.languagesKnown || [],
          languagesLearning: profileUser.languagesLearning || []
        })

        if (me && me._id !== userId) {
          try {
            const status = await getConnectionStatus(userId)
            setConnectionStatus(status)
          } catch (err) {
            console.error('Failed to check connection status')
          }
        }
      } catch (err) {
        console.error('Failed to load user:', err)
        setError('User not found')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId])

  useEffect(() => {
    if (isEditing) {
      getInterests()
        .then(setAvailableInterests)
        .catch(() => setAvailableInterests([]))
    }
  }, [isEditing])

  const isOwnProfile = currentUser && currentUser._id === user?._id

  const handleConnect = async () => {
    try {
      setConnecting(true)
      await sendConnectionRequest(userId)
      const status = await getConnectionStatus(userId)
      setConnectionStatus(status)
    } catch (err) {
      console.error('Failed to connect:', err)
      alert('Connection request sent! Check your notifications.')
      setConnectionStatus({ status: 'pending' })
    } finally {
      setConnecting(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      const updated = await updateProfile(editData)
      setUser(updated)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert(err.error || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert('Please enter your password')
      return
    }

    try {
      setIsDeleting(true)
      await deleteProfile(deletePassword)
      localStorage.removeItem('user')
      alert('Account deleted successfully')
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Failed to delete account:', err)
      alert(err.error || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
      setDeletePassword('')
    }
  }

  if (isLoading) {
    return <MainLayout currentUser={currentUser} isLoading={true} />
  }

  if (error || !user) {
    return (
      <MainLayout currentUser={currentUser}>
        <div className="p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
          <div className="card bg-red-50 border border-red-200 text-center py-16">
            <p className="text-xl text-red-700 font-medium">{error || 'User not found'}</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout currentUser={currentUser}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 sm:mb-8 font-medium text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span>Go Back</span>
        </button>

        {/* Profile Header */}
        <div className="card mb-8">
          {isEditing ? (
            // EDIT MODE
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-600 hover:text-slate-900 p-1"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  className="input-field w-full text-sm"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={editData.bio}
                  onChange={e => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="input-field w-full resize-none text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">{editData.bio.length}/500</p>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-3">
                  Interests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => {
                        setEditData({
                          ...editData,
                          interests: editData.interests.includes(interest)
                            ? editData.interests.filter(i => i !== interest)
                            : [...editData.interests, interest]
                        })
                      }}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all border-2 ${
                        editData.interests.includes(interest)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages Known */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                  Languages You Speak
                </label>
                <MultiSelect
                  options={LANGUAGES}
                  selected={editData.languagesKnown}
                  onChange={langs => setEditData({ ...editData, languagesKnown: langs })}
                  placeholder="Select languages"
                />
              </div>

              {/* Languages Learning */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                  Languages You're Learning
                </label>
                <MultiSelect
                  options={LANGUAGES}
                  selected={editData.languagesLearning}
                  onChange={langs => setEditData({ ...editData, languagesLearning: langs })}
                  placeholder="Select languages"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            // VIEW MODE
            <>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-3xl flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{user.name}</h1>
                    <p className="text-sm sm:text-base text-slate-600 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit2 size={18} />
                      <span className="hidden sm:inline">Edit Profile</span>
                      <span className="sm:hidden">Edit</span>
                    </button>
                  )}
                  {!isOwnProfile && currentUser && (
                    <>
                      <button
                        onClick={handleConnect}
                        disabled={connecting || connectionStatus?.status === 'accepted'}
                        className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          connectionStatus?.status === 'accepted'
                            ? 'bg-green-50 text-green-700 cursor-default'
                            : 'btn-primary'
                        }`}
                      >
                        <UserPlus size={18} />
                        <span className="hidden sm:inline">
                          {connectionStatus?.status === 'accepted' ? 'Connected' : 'Connect'}
                        </span>
                        <span className="sm:hidden">
                          {connectionStatus?.status === 'accepted' ? 'Connected' : 'Add'}
                        </span>
                      </button>
                      {connectionStatus?.status === 'accepted' && (
                        <button
                          onClick={() => navigate(`/chat/${user._id}`)}
                          className="btn-secondary flex items-center justify-center gap-2 text-sm"
                        >
                          <MessageCircle size={18} />
                          <span>Chat</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {user.bio && (
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 pb-6 border-b border-slate-200">
                  {user.bio}
                </p>
              )}

              {/* Language Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-8">
                {user.languagesKnown && user.languagesKnown.length > 0 && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase mb-3 tracking-wide">
                      Languages Known
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.languagesKnown.map(lang => (
                        <span
                          key={lang}
                          className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {user.languagesLearning && user.languagesLearning.length > 0 && (
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase mb-3 tracking-wide">
                      Learning Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.languagesLearning.map(lang => (
                        <span
                          key={lang}
                          className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Interests */}
              {user.interests && user.interests.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase mb-4 tracking-wide">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map(interest => (
                      <span
                        key={interest}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Badge */}
              {user.subscription && (
                <div className="mb-8 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm sm:text-base text-amber-800 font-medium">⭐ Premium Member</p>
                  <p className="text-xs sm:text-sm text-amber-700">This user has access to all LinguaLink Premium features</p>
                </div>
              )}

              {/* Delete Account Section */}
              {isOwnProfile && (
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Danger Zone</h3>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete Account
                  </button>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Delete Account</h2>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
              This will permanently delete your account and all associated data. This cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                }}
                className="flex-1 btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
                className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
