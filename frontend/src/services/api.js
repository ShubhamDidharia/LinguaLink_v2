import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const client = axios.create({ 
  baseURL: BASE,
  withCredentials: true // Send cookies automatically
})

// Intercept responses to handle errors globally 
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

export default { login, signup, logout, getMe, getInterests, getUsers, getUser }
