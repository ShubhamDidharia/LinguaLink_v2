import React, { useState, useEffect } from 'react'
import { Plus, Trash2, FolderPlus, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showSuccess, showError } from '../utils/toast'
import MainLayout from '../components/MainLayout'
import {
  getUserWorkspaces,
  deleteWorkspace,
  getDeletedWorkspaceLanguages,
  createWorkspace,
  getMe,
} from '../services/api'
import LanguageFolder from '../components/LanguageFolder'

export default function Workspace() {
  const [currentUser, setCurrentUser] = useState(null)
  const [workspaces, setWorkspaces] = useState([])
  const [deletedLanguages, setDeletedLanguages] = useState([])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newLanguage, setNewLanguage] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const navigate = useNavigate()

  const languages = [
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Mandarin',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Dutch',
    'Swedish',
    'Polish',
    'Turkish',
  ]

  // Fetch user and workspaces on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const user = await getMe()
      setCurrentUser(user)
      await loadWorkspaces()
    } catch (err) {
      navigate('/login', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const loadWorkspaces = async () => {
    try {
      const data = await getUserWorkspaces()
      setWorkspaces(data)
      if (data.length > 0 && !selectedWorkspaceId) {
        setSelectedWorkspaceId(data[0]._id)
      }
    } catch (err) {
      setError(err.message || 'Failed to load workspaces')
    }
  }

  const loadDeletedLanguages = async () => {
    try {
      const data = await getDeletedWorkspaceLanguages()
      setDeletedLanguages(data.deletedLanguages)
    } catch (err) {
      console.error('Failed to load deleted languages:', err)
    }
  }

  const handleDeleteWorkspace = async (workspaceId) => {
    if (!window.confirm('Delete this language folder? You can recreate it later.')) return

    try {
      await deleteWorkspace(workspaceId)
      setWorkspaces(workspaces.filter((w) => w._id !== workspaceId))
      if (selectedWorkspaceId === workspaceId) {
        setSelectedWorkspaceId(workspaces.length > 1 ? workspaces[0]._id : null)
      }
      await loadDeletedLanguages()
      showSuccess('Workspace deleted successfully 🗑️')
    } catch (err) {
      const msg = err.message || 'Failed to delete workspace'
      setError(msg)
      showError(msg)
    }
  }

  const handleCreateWorkspace = async () => {
    if (!newLanguage.trim()) {
      showError('Please select a language')
      setError('Please select a language')
      return
    }

    try {
      setIsCreating(true)
      setError('')
      await createWorkspace(newLanguage)
      setNewLanguage('')
      setShowCreateForm(false)
      await loadWorkspaces()
      await loadDeletedLanguages()
      showSuccess(`${newLanguage} workspace created! 🎉`)
    } catch (err) {
      const msg = err.message || 'Failed to create workspace'
      setError(msg)
      showError(msg)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <MainLayout currentUser={currentUser} isLoading={loading}>
      <div className="p-6 sm:p-8 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            My Language Workspace
          </h1>
          <p className="text-slate-600">
            Organize and manage vocabulary for languages you're learning
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Language Folders */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl sticky top-6 p-6 shadow-md border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Languages</h2>

              <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                {workspaces.length === 0 ? (
                  <p className="text-slate-500 text-sm">No workspace folders yet</p>
                ) : (
                  workspaces.map((workspace) => (
                    <div
                      key={workspace._id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                        selectedWorkspaceId === workspace._id
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedWorkspaceId(workspace._id)}
                        className="flex-1 text-left font-medium text-sm"
                      >
                        {workspace.language}
                        <span className="text-xs ml-2 text-slate-500">
                          ({workspace.vocabCount})
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteWorkspace(workspace._id)}
                        className="text-slate-400 hover:text-red-600 transition"
                        title="Delete folder"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Create New Folder Section */}
              <div className="border-t border-slate-200 pt-4">
                <button
                  onClick={() => {
                    setShowCreateForm(!showCreateForm)
                    if (!showCreateForm) loadDeletedLanguages()
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 mb-3"
                >
                  <FolderPlus size={16} />
                  Create New Folder
                </button>

                {showCreateForm && (
                  <div className="space-y-3 bg-slate-50 p-3 rounded-lg">
                    <select
                      value={newLanguage}
                      onChange={(e) => {
                        setNewLanguage(e.target.value)
                        setError('')
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                    >
                      <option value="">Select a language...</option>
                      {languages
                        .filter(
                          (lang) =>
                            !workspaces.some((w) => w.language === lang) ||
                            deletedLanguages.includes(lang)
                        )
                        .map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateWorkspace}
                        disabled={isCreating || !newLanguage}
                        className="flex-1 bg-indigo-600 text-white p-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition disabled:bg-slate-400 flex items-center justify-center gap-2"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            Create
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-3 py-2 bg-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Selected Language Folder */}
          <div className="lg:col-span-3">
            {selectedWorkspaceId ? (
              <LanguageFolder workspaceId={selectedWorkspaceId} onFolderUpdate={loadWorkspaces} />
            ) : (
              <div className="card p-12 text-center">
                <FolderPlus size={48} className="mx-auto mb-4 text-indigo-600" />
                <p className="text-slate-600 mb-4">No language folders created yet</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Create Your First Folder
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
