import React, { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { api } from '../lib/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    api('/api/users').then(setUsers).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])
  const filtered = users.filter(u => (u.name || '').toLowerCase().includes(q.toLowerCase()) || (u.email || '').toLowerCase().includes(q.toLowerCase()))
  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    const updated = await api('/api/users/' + u._id + '/role', { method: 'PUT', body: JSON.stringify({ role: newRole }) })
    setUsers(users.map(x => x._id === u._id ? updated : x))
  }
  const toggleActive = async (u) => {
    const updated = await api('/api/users/' + u._id + '/status', { method: 'PUT', body: JSON.stringify({ active: !(u.active !== false) }) })
    setUsers(users.map(x => x._id === u._id ? updated : x))
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="orbit-h2 mb-1">Users</h1>
        <p className="orbit-body mb-4">Manage registered users.</p>
        <input className="form-control mb-3" placeholder="Search users..." value={q} onChange={e => setQ(e.target.value)} style={{ maxWidth: 320 }} />
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'var(--orbit-danger)' }}>{error}</p>}
        <div className="admin-card">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id}>
                    <td>{u.name || '—'}</td>
                    <td>{u.email}</td>
                    <td><span className="badge-orbit badge-free">{u.role}</span></td>
                    <td>{u.active !== false ? 'Active' : 'Disabled'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="d-flex gap-1 flex-wrap">
                      <button className="btn-orbit btn-orbit-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => toggleRole(u)}>{u.role === 'admin' ? 'Demote' : 'Promote'}</button>
                      <button className="btn-orbit btn-orbit-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--orbit-danger)' }} onClick={() => toggleActive(u)}>{u.active !== false ? 'Deactivate' : 'Activate'}</button>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && <tr><td colSpan={6} className="text-center orbit-small">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}