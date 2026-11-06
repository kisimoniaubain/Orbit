import React, { useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { api } from '../lib/api'

export default function AdminNotifications() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const send = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const result = await api('/api/admin/notifications/email', {
        method: 'POST',
        body: JSON.stringify({ title, message }),
      })
      setSent([{ title, message, delivered: result.delivered, failed: result.failed, skipped: result.skipped, total: result.total, date: new Date().toLocaleString() }, ...sent])
      if (result.failed || result.skipped) {
        setError(`Accepted for ${result.delivered} of ${result.total} valid recipients. ${result.failed} failed; ${result.skipped} invalid addresses were skipped.`)
      }
      setTitle('')
      setMessage('')
    } catch (e) {
      setError(e.message || 'Failed to send notification email')
    } finally {
      setSending(false)
    }
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="orbit-h2 mb-1">Notifications</h1>
        <p className="orbit-body mb-4">Email marketplace announcements to all active registered users.</p>
        <div className="admin-card mb-4">
          <form onSubmit={send} className="d-flex flex-column gap-2" style={{ maxWidth: 500 }}>
            <input className="form-control" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea className="form-control" placeholder="Message" rows={3} value={message} onChange={e => setMessage(e.target.value)} required />
            {error && <p role="alert" className="orbit-small" style={{ color: 'var(--orbit-danger)' }}>{error}</p>}
            <button className="btn-orbit btn-orbit-primary" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Email All Active Users'}</button>
          </form>
        </div>
        <div className="admin-card">
          <h3 className="orbit-h3 mb-3">Sent</h3>
          {sent.length === 0 && <p className="orbit-small">No notifications sent yet.</p>}
          <ul className="orbit-small" style={{ paddingLeft: 18 }}>
            {sent.map((n, i) => <li key={i}><strong>{n.title}</strong> — {n.message} <span className="orbit-small">({n.delivered}/{n.total} accepted by mail server; {n.failed} failed, {n.skipped} invalid skipped, {n.date})</span></li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}