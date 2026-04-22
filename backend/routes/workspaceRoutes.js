import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
  getUserWorkspaces,
  createWorkspace,
  deleteWorkspace,
  getVocabularies,
  addVocabulary,
  updateVocabulary,
  deleteVocabulary,
  addVocabularyFromAIDictionary,
  getDeletedWorkspaceLanguages,
} from '../controllers/workspaceController.js'

const router = express.Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Workspace routes
router.get('/', getUserWorkspaces)
router.post('/', createWorkspace)
router.delete('/:workspaceId', deleteWorkspace)
router.get('/deleted-languages', getDeletedWorkspaceLanguages)

// Vocabulary routes
router.get('/:workspaceId/vocabularies', getVocabularies)
router.post('/:workspaceId/vocabularies', addVocabulary)
router.put('/vocabularies/:vocabularyId', updateVocabulary)
router.delete('/vocabularies/:vocabularyId', deleteVocabulary)

// AI Dictionary integration
router.post('/vocabularies/ai-add', addVocabularyFromAIDictionary)

export default router
