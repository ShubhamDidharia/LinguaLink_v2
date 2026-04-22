import Workspace from '../models/Workspace.js'
import Vocabulary from '../models/Vocabulary.js'
import { GoogleGenAI } from '@google/genai'
import { retryWithBackoff } from '../utils/retryUtils.js'
import 'dotenv/config'

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Get all workspace folders for a user
export const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user.userId
    const workspaces = await Workspace.find({ userId, isDeleted: false }).sort({ createdAt: -1 })

    // Get vocabulary count for each workspace
    const workspacesWithCount = await Promise.all(
      workspaces.map(async (workspace) => {
        const vocabCount = await Vocabulary.countDocuments({ workspaceId: workspace._id })
        return {
          _id: workspace._id,
          language: workspace.language,
          vocabCount,
          createdAt: workspace.createdAt,
        }
      })
    )

    res.status(200).json(workspacesWithCount)
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    res.status(500).json({ message: 'Error fetching workspaces', error: error.message })
  }
}

// Create a new workspace folder for a language
export const createWorkspace = async (req, res) => {
  try {
    const userId = req.user.userId
    const { language } = req.body

    if (!language) {
      return res.status(400).json({ message: 'Language is required' })
    }

    // Check if workspace already exists for this language
    const existingWorkspace = await Workspace.findOne({ userId, language })

    if (existingWorkspace && !existingWorkspace.isDeleted) {
      return res.status(400).json({ message: 'Workspace for this language already exists' })
    }

    // If workspace exists but is deleted, restore it
    if (existingWorkspace && existingWorkspace.isDeleted) {
      existingWorkspace.isDeleted = false
      await existingWorkspace.save()
      return res.status(200).json({
        message: 'Workspace restored',
        workspace: {
          _id: existingWorkspace._id,
          language: existingWorkspace.language,
          vocabCount: 0,
        },
      })
    }

    // Create new workspace
    const newWorkspace = new Workspace({ userId, language })
    await newWorkspace.save()

    res.status(201).json({
      message: 'Workspace created',
      workspace: {
        _id: newWorkspace._id,
        language: newWorkspace.language,
        vocabCount: 0,
      },
    })
  } catch (error) {
    console.error('Error creating workspace:', error)
    res.status(500).json({ message: 'Error creating workspace', error: error.message })
  }
}

// Delete a workspace folder (soft delete)
export const deleteWorkspace = async (req, res) => {
  try {
    const userId = req.user.userId
    const { workspaceId } = req.params

    const workspace = await Workspace.findOne({ _id: workspaceId, userId })

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' })
    }

    // Soft delete
    workspace.isDeleted = true
    await workspace.save()

    res.status(200).json({ message: 'Workspace deleted. You can recreate it later.' })
  } catch (error) {
    console.error('Error deleting workspace:', error)
    res.status(500).json({ message: 'Error deleting workspace', error: error.message })
  }
}

// Get all vocabularies in a workspace
export const getVocabularies = async (req, res) => {
  try {
    const userId = req.user.userId
    const { workspaceId } = req.params

    const workspace = await Workspace.findOne({ _id: workspaceId, userId, isDeleted: false })

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' })
    }

    const vocabularies = await Vocabulary.find({ workspaceId }).sort({ createdAt: -1 })

    res.status(200).json(vocabularies)
  } catch (error) {
    console.error('Error fetching vocabularies:', error)
    res.status(500).json({ message: 'Error fetching vocabularies', error: error.message })
  }
}

// Add vocabulary to a workspace (manual)
export const addVocabulary = async (req, res) => {
  try {
    const userId = req.user.userId
    const { workspaceId } = req.params
    const { word, meaning, examples, synonyms, tags } = req.body

    if (!word || !meaning) {
      return res.status(400).json({ message: 'Word and meaning are required' })
    }

    const workspace = await Workspace.findOne({ _id: workspaceId, userId, isDeleted: false })

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' })
    }

    const newVocab = new Vocabulary({
      workspaceId,
      userId,
      word,
      meaning,
      language: workspace.language,
      examples: examples || [],
      synonyms: synonyms || [],
      tags: tags || [],
      addedVia: 'manual',
    })

    await newVocab.save()

    res.status(201).json({ message: 'Vocabulary added', vocabulary: newVocab })
  } catch (error) {
    console.error('Error adding vocabulary:', error)
    res.status(500).json({ message: 'Error adding vocabulary', error: error.message })
  }
}

// Update vocabulary
export const updateVocabulary = async (req, res) => {
  try {
    const userId = req.user.userId
    const { vocabularyId } = req.params
    const { word, meaning, examples, synonyms, tags } = req.body

    const vocabulary = await Vocabulary.findOne({ _id: vocabularyId, userId })

    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary not found' })
    }

    if (word) vocabulary.word = word
    if (meaning) vocabulary.meaning = meaning
    if (examples) vocabulary.examples = examples
    if (synonyms) vocabulary.synonyms = synonyms
    if (tags) vocabulary.tags = tags

    await vocabulary.save()

    res.status(200).json({ message: 'Vocabulary updated', vocabulary })
  } catch (error) {
    console.error('Error updating vocabulary:', error)
    res.status(500).json({ message: 'Error updating vocabulary', error: error.message })
  }
}

// Delete vocabulary
export const deleteVocabulary = async (req, res) => {
  try {
    const userId = req.user.userId
    const { vocabularyId } = req.params

    const vocabulary = await Vocabulary.findOne({ _id: vocabularyId, userId })

    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary not found' })
    }

    await Vocabulary.deleteOne({ _id: vocabularyId })

    res.status(200).json({ message: 'Vocabulary deleted' })
  } catch (error) {
    console.error('Error deleting vocabulary:', error)
    res.status(500).json({ message: 'Error deleting vocabulary', error: error.message })
  }
}

// Detect language using Gemini and add to appropriate workspace
export const addVocabularyFromAIDictionary = async (req, res) => {
  try {
    const userId = req.user.userId
    const { word, meaning } = req.body

    if (!word || !meaning) {
      return res.status(400).json({ message: 'Word and meaning are required' })
    }

    // Detect language using Gemini with retry logic
    const detectionPrompt = `Detect the language of this word: "${word}". 
Return only the language name in English (e.g., Spanish, French, German, Mandarin, Japanese, etc.). 
Just one word, the language name.`

    const detectionResponse = await retryWithBackoff(
      async () => {
        return await client.models.generateContent({
          model: 'models/gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: detectionPrompt }],
            },
          ],
        })
      },
      3, // max retries
      1000 // initial delay in ms
    )

    const detectedLanguageText = (() => {
      if (!detectionResponse) return 'Unknown'
      if (typeof detectionResponse.text === 'function') return detectionResponse.text()
      if (typeof detectionResponse.text === 'string') return detectionResponse.text
      const parts = detectionResponse.candidates?.[0]?.content?.parts || []
      return parts.map((part) => part.text || '').join('')
    })()

    const detectedLanguage = detectedLanguageText.trim()

    // Find or create workspace for detected language
    let workspace = await Workspace.findOne({ userId, language: detectedLanguage, isDeleted: false })

    if (!workspace) {
      workspace = new Workspace({ userId, language: detectedLanguage })
      await workspace.save()
    }

    // Add vocabulary
    const newVocab = new Vocabulary({
      workspaceId: workspace._id,
      userId,
      word,
      meaning,
      language: detectedLanguage,
      addedVia: 'ai-dictionary',
    })

    await newVocab.save()

    res.status(201).json({
      message: 'Vocabulary added to workspace',
      language: detectedLanguage,
      vocabulary: newVocab,
    })
  } catch (error) {
    console.error('Error adding vocabulary from AI dictionary:', error)
    const status = error?.status || error?.response?.status || 500

    if (status === 503) {
      return res.status(503).json({
        message: 'Gemini API Temporarily Unavailable',
        details: 'The service is experiencing high demand. Please try again in a few moments.',
        retryable: true,
      })
    }

    if (status === 429) {
      return res.status(429).json({
        message: 'Gemini API Rate Limited',
        details: 'Too many requests. Please wait a few minutes before trying again.',
        retryable: true,
      })
    }

    res.status(500).json({
      message: 'Error adding vocabulary from AI dictionary',
      error: error.message,
      retryable: false,
    })
  }
}

// Get deleted workspaces to allow recreation
export const getDeletedWorkspaceLanguages = async (req, res) => {
  try {
    const userId = req.user.userId

    const deletedWorkspaces = await Workspace.find({ userId, isDeleted: true })

    const languages = deletedWorkspaces.map((w) => w.language)

    res.status(200).json({ deletedLanguages: languages })
  } catch (error) {
    console.error('Error fetching deleted workspaces:', error)
    res.status(500).json({ message: 'Error fetching deleted workspaces', error: error.message })
  }
}
