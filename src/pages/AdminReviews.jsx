import React, { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { api } from '../lib/api'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = () => api('/api/reviews').then(setReviews).catch(e => setError(e.message)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])
  const remove = async (id) => { if (!confirm('Delete review?')) return; await api('/api/reviews/' + id, { method: 'DELETE' }); load() }
  const approve = async (r) => { await api('/api/reviews/' + r._id, { method: 'PUT', body: JSON.stringify({ status: 'approved' }) }); load() }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="orbit-h2 mb-1">Reviews</h1>
        <p className="orbit-body mb-4">Moderate customer reviews.</p>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'var(--orbit-danger)' }}>{error}</p>}
        <div className="admin-card">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>User</th><th>Product</th><th>Rating</th><th>Comment</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r._id}>
                    <td>{r.user?.name || r.user?.email || '—'}</td>
                    <td>{r.product?.name || '—'}</td>
                    <td>{r.rating}</td>
                    <td>{r.comment}</td>
                    <td>{r.status}</td>
                    <td className="d-flex gap-1">
                      {r.status !== 'approved' && <button className="btn-orbit btn-orbit-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => approve(r)}>Approve</button>}
                      <button className="btn-orbit btn-orbit-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--orbit-danger)' }} onClick={() => remove(r._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!loading && reviews.length === 0 && <tr><td colSpan={6} className="text-center orbit-small">No reviews yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}