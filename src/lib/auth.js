import { api, setToken } from './api'

export async function login(email, password) {
  const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  if (data.requiresVerification) {
    return data // { requiresVerification, email }
  }
  setToken(data.token)
  localStorage.setItem('orbit_user', JSON.stringify(data.user))
  return data.user
}

export async function register(name, email, password) {
  const data = await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
  setToken(data.token)
  localStorage.setItem('orbit_user', JSON.stringify(data.user))
  return { ...data.user, emailSent: data.emailSent, emailWarning: data.emailWarning }
}

export function logout() {
  setToken(null)
  localStorage.removeItem('orbit_user')
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem('orbit_user') || 'null') } catch { return null }
}

export async function refreshUser() {
  try {
    const data = await api('/api/auth/me')
    if (data?.user) localStorage.setItem('orbit_user', JSON.stringify(data.user))
    return data?.user
  } catch { return getUser() }
}

export function isAdmin() {
  const u = getUser()
  return !!u && u.role === 'admin'
}
