import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const client = axios.create({ 
  baseURL: BASE,
  withCredentials: true
})

client.interceptors.response.use(
  res => res,
  err => {
    const data = err.response?.data || { error: err.message }
    return Promise.reject(data)
  }
)

export async function login(email, password) {
  const res = await client.post('/api/auth/login', { email, password })
  return res.data
}

export async function signup(payload) {
  const res = await client.post('/api/auth/signup', payload)
  return res.data
}

export async function logout() {
  const res = await client.post('/api/auth/logout')
  return res.data
}

export async function getMe() {
  const res = await client.get('/api/auth/me')
  return res.data
}

export async function getInterests() {
  const res = await client.get('/api/interests')
  return res.data
}

export async function getUsers() {
  const res = await client.get('/api/users')
  return res.data
}

export async function getUser(userId) {
  const res = await client.get(`/api/auth/users/${userId}`)
  return res.data
}

// Connection endpoints
export async function sendConnectionRequest(receiverId) {
  const res = await client.post('/api/connections', { receiverId })
  return res.data
}

export async function getPendingConnections() {
  const res = await client.get('/api/connections/pending')
  return res.data
}

export async function getAcceptedConnections() {
  const res = await client.get('/api/connections/accepted')
  return res.data
}

export async function respondToConnectionRequest(connectionId, action) {
  const res = await client.put(`/api/connections/${connectionId}`, { action })
  return res.data
}

export async function getConnectionStatus(otherUserId) {
  const res = await client.get(`/api/connections/status/${otherUserId}`)
  return res.data
}

// Message endpoints
export async function sendMessage(receiverId, content) {
  const res = await client.post('/api/messages', { receiverId, content })
  return res.data
}

export async function getMessages(otherUserId) {
  const res = await client.get(`/api/messages/${otherUserId}`)
  return res.data
}

export async function getConversations() {
  const res = await client.get('/api/messages/conversations')
  return res.data
}

export async function markMessagesAsRead(otherUserId) {
  const res = await client.put(`/api/messages/${otherUserId}/read`)
  return res.data
}

export async function updateProfile(profileData) {
  const res = await client.put('/api/auth/profile', profileData)
  return res.data
}

export async function deleteProfile(password) {
  const res = await client.delete('/api/auth/profile', {
    data: { password }
  })
  return res.data
}

export async function translateAndDefine(text, targetLanguage) {
  const res = await client.post('/api/dictionary/translate', { text, targetLanguage })
  return res.data
}

// Workspace endpoints
export async function getUserWorkspaces() {
  const res = await client.get('/api/workspaces')
  return res.data
}

export async function createWorkspace(language) {
  const res = await client.post('/api/workspaces', { language })
  return res.data
}

export async function deleteWorkspace(workspaceId) {
  const res = await client.delete(`/api/workspaces/${workspaceId}`)
  return res.data
}

export async function getDeletedWorkspaceLanguages() {
  const res = await client.get('/api/workspaces/deleted-languages')
  return res.data
}

// Vocabulary endpoints
export async function getVocabularies(workspaceId) {
  const res = await client.get(`/api/workspaces/${workspaceId}/vocabularies`)
  return res.data
}

export async function addVocabulary(workspaceId, vocabData) {
  const res = await client.post(`/api/workspaces/${workspaceId}/vocabularies`, vocabData)
  return res.data
}

export async function updateVocabulary(vocabularyId, vocabData) {
  const res = await client.put(`/api/workspaces/vocabularies/${vocabularyId}`, vocabData)
  return res.data
}

export async function deleteVocabulary(vocabularyId) {
  const res = await client.delete(`/api/workspaces/vocabularies/${vocabularyId}`)
  return res.data
}

export async function addVocabularyFromAIDictionary(word, meaning) {
  const res = await client.post('/api/workspaces/vocabularies/ai-add', { word, meaning })
  return res.data
}

// Email endpoints
export async function toggleDailyEmail(enabled) {
  const res = await client.post('/api/email/toggle-daily', { enabled })
  return res.data
}

export async function getDailyEmailStatus() {
  const res = await client.get('/api/email/daily-status')
  return res.data
}

export default {
  login,
  signup,
  logout,
  getMe,
  getInterests,
  getUsers,
  getUser,
  sendConnectionRequest,
  getPendingConnections,
  getAcceptedConnections,
  respondToConnectionRequest,
  getConnectionStatus,
  sendMessage,
  getMessages,
  getConversations,
  markMessagesAsRead,
  updateProfile,
  deleteProfile,
  translateAndDefine,
  getUserWorkspaces,
  createWorkspace,
  deleteWorkspace,
  getDeletedWorkspaceLanguages,
  getVocabularies,
  addVocabulary,
  updateVocabulary,
  deleteVocabulary,
  addVocabularyFromAIDictionary,
  toggleDailyEmail,
  getDailyEmailStatus,
}
