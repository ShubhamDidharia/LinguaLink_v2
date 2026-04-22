import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'
import {
  getVocabularies,
  addVocabulary,
  updateVocabulary,
  deleteVocabulary,
  addVocabularyFromAIDictionary,
} from '../services/api'

const LanguageFolder = ({ workspaceId, onFolderUpdate }) => {
  const [vocabularies, setVocabularies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    examples: '',
    synonyms: '',
    tags: '',
  })

  // Load vocabularies
  useEffect(() => {
    loadVocabularies()
  }, [workspaceId])

  const loadVocabularies = async () => {
    try {
      setLoading(true)
      const data = await getVocabularies(workspaceId)
      setVocabularies(data)
    } catch (err) {
      setError(err.message || 'Failed to load vocabularies')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      word: '',
      meaning: '',
      examples: '',
      synonyms: '',
      tags: '',
    })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.word.trim() || !formData.meaning.trim()) {
      setError('Word and meaning are required')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const payload = {
        word: formData.word.trim(),
        meaning: formData.meaning.trim(),
        examples: formData.examples
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e),
        synonyms: formData.synonyms
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s),
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t),
      }

      if (editingId) {
        await updateVocabulary(editingId, payload)
      } else {
        await addVocabulary(workspaceId, payload)
      }

      await loadVocabularies()
      resetForm()
      if (onFolderUpdate) onFolderUpdate()
    } catch (err) {
      setError(err.message || 'Failed to save vocabulary')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (vocab) => {
    setFormData({
      word: vocab.word,
      meaning: vocab.meaning,
      examples: vocab.examples?.join(', ') || '',
      synonyms: vocab.synonyms?.join(', ') || '',
      tags: vocab.tags?.join(', ') || '',
    })
    setEditingId(vocab._id)
    setShowForm(true)
  }

  const handleDelete = async (vocabId) => {
    if (!window.confirm('Delete this vocabulary item?')) return

    try {
      await deleteVocabulary(vocabId)
      await loadVocabularies()
      if (onFolderUpdate) onFolderUpdate()
    } catch (err) {
      setError(err.message || 'Failed to delete vocabulary')
    }
  }

  const filteredVocabularies = vocabularies.filter(
    (vocab) =>
      vocab.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vocab.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    )
  }

  return (
    <div className="card p-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search vocabulary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />
          Add Word
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900">
              {editingId ? 'Edit Word' : 'Add New Word'}
            </h3>
            <button
              onClick={resetForm}
              className="text-slate-500 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Word or Phrase *"
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Meaning *"
                value={formData.meaning}
                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <textarea
              placeholder="Examples (separate by commas)"
              value={formData.examples}
              onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows="2"
            />

            <input
              type="text"
              placeholder="Synonyms (separate by commas)"
              value={formData.synonyms}
              onChange={(e) => setFormData({ ...formData, synonyms: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <input
              type="text"
              placeholder="Tags (separate by commas)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-slate-400 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {editingId ? 'Update Word' : 'Add Word'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vocabulary List */}
      <div className="space-y-4">
        {filteredVocabularies.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="mb-3">
              {vocabularies.length === 0
                ? 'No vocabulary items yet. Start by adding your first word!'
                : 'No matching vocabulary found.'}
            </p>
          </div>
        ) : (
          filteredVocabularies.map((vocab) => (
            <div
              key={vocab._id}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900">{vocab.word}</h4>
                  <p className="text-slate-700 mb-3">{vocab.meaning}</p>

                  {vocab.examples && vocab.examples.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-slate-600">Examples:</p>
                      <ul className="text-sm text-slate-600 ml-4">
                        {vocab.examples.map((ex, idx) => (
                          <li key={idx} className="list-disc">
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {vocab.synonyms && vocab.synonyms.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-slate-600">Synonyms:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {vocab.synonyms.map((syn, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {vocab.tags && vocab.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-600">Tags:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {vocab.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-3">
                    Added via: {vocab.addedVia === 'ai-dictionary' ? '🤖 AI Dictionary' : '✍️ Manual'}
                  </p>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  <button
                    onClick={() => handleEdit(vocab)}
                    className="flex-1 sm:flex-none p-2 text-indigo-600 hover:bg-indigo-100 rounded transition"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(vocab._id)}
                    className="flex-1 sm:flex-none p-2 text-red-600 hover:bg-red-100 rounded transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {vocabularies.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            📚 Total: <span className="font-bold text-slate-900">{vocabularies.length}</span>{' '}
            words | 🔍 Showing:{' '}
            <span className="font-bold text-slate-900">{filteredVocabularies.length}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default LanguageFolder
