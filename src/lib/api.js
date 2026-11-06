const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function getToken() { return localStorage.getItem('orbit_token') }
export function setToken(t) { if (t) localStorage.setItem('orbit_token', t); else localStorage.removeItem('orbit_token') }

export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(BASE + path, { ...options, headers })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) throw new Error((data && data.error) || res.statusText)
  return data
}
