import React, { useState, useEffect } from 'react'
import { getUser, logout, refreshUser } from '../lib/auth'
import { api, setToken } from '../lib/api'
import { gravatarUrl } from '../lib/gravatar'
import { loadProducts } from '../lib/products'
import { getFavorites } from '../lib/favorites'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TemplateCard from '../components/TemplateCard'
import { Link } from 'react-router-dom'
import { Settings, Key, Bell, HelpCircle, LogOut, Edit } from 'lucide-react'

export default function Profile() {
  const [u, setU] = useState(getUser())
  const [products, setProducts] = useState([])
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  useEffect(() => { setAvatarUrl(u?.avatarUrl || '') }, [u])
  useEffect(() => { if (getUser()) refreshUser().then(() => setU(getUser())); loadProducts().then(setProducts) }, [])
  const saveAvatar = async () => {
    setSaving(true)
    try {
      const data = await api('/api/auth/profile', { method: 'PUT', body: JSON.stringify({ name: u?.name, avatarUrl }) })
      localStorage.setItem('orbit_user', JSON.stringify(data.user))
      window.location.reload()
    } catch (e) { alert(e.message) }
    setSaving(false)
  }
  const favIds = getFavorites()
  const saved = products.filter(t => favIds.includes(t.id || t._id))
  const stats = [
    { label: 'Purchased', value: 0 },
    { label: 'Saved', value: saved.length },
    { label: 'Free downloads', value: 0 },
    { label: 'Reviews', value: 0 },
  ]
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '40px 24px 64px' }}>
        {/* Header */}
        <div className="orbit-card" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          {u?.avatarUrl ? (
            <img src={u.avatarUrl} alt="avatar" referrerPolicy="no-referrer" style={{ width: 96, height: 96, borderRadius: '50%', display: 'block', border: '2px solid var(--orbit-primary)' }} />
          ) : (
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--orbit-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 36, border: '2px solid var(--orbit-primary)' }}>
              {(u?.name || u?.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 className="orbit-h3" style={{ margin: 0 }}>{u?.name || 'Guest'}</h1>
            <p className="orbit-small" style={{ margin: 0 }}>@{(u?.email || '').split('@')[0]} · Member since 2026</p>
            <p className="orbit-body" style={{ margin: '8px 0 0' }}>Short bio goes here. Edit your profile to add one.</p>
            <div className="d-flex gap-2 mt-2 flex-wrap">
              <a href="#" className="orbit-small">Portfolio</a>
              <span className="orbit-small">· Location</span>
            </div>
          </div>
            <button className="btn-orbit btn-orbit-secondary" style={{ height: 'auto', padding: '8px 16px' }}><Edit size={14} /> Edit Profile</button>
          <div className="d-flex gap-2 mt-2" style={{ maxWidth: 400 }}>
              <input className="form-control" placeholder="Avatar image URL" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} />
              <button className="btn-orbit btn-orbit-secondary" style={{ height: 'auto', padding: '6px 12px' }} onClick={saveAvatar} disabled={saving}>{saving ? '...' : 'Save'}</button>
            </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mt-3">
          {stats.map(s => (
            <div className="col-6 col-md-3" key={s.label}>
              <div className="orbit-card" style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
                <div className="orbit-small">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Purchases */}
        <section className="mt-4">
          <h2 className="orbit-h3 mb-3">My purchases</h2>
          <div className="orbit-card" style={{ padding: 24 }}>
            <p className="orbit-body">No purchases yet. Purchased templates will appear here.</p>
          </div>
        </section>

        {/* Saved */}
        <section className="mt-4">
          <h2 className="orbit-h3 mb-3">Saved resources</h2>
          {saved.length === 0 ? (
            <div className="orbit-card" style={{ padding: 24 }}><p className="orbit-body">No saved templates yet.</p></div>
          ) : (
            <div className="row g-4">
              {saved.map(t => <div className="col-md-4" key={t.id || t._id}><TemplateCard t={t} /></div>)}
            </div>
          )}
        </section>

        {/* Reviews */}
        <section className="mt-4">
          <h2 className="orbit-h3 mb-3">Reviews and ratings</h2>
          <div className="orbit-card" style={{ padding: 24 }}>
            <p className="orbit-body">You haven't written any reviews yet.</p>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-4">
          <h2 className="orbit-h3 mb-3">Quick actions</h2>
          <div className="d-flex flex-wrap gap-2">
            <LinkBtn to="/settings" icon={<Settings size={16} />} label="Settings" />
            <LinkBtn to="/signin" icon={<Key size={16} />} label="Change password" />
            <LinkBtn to="/settings" icon={<Bell size={16} />} label="Notifications" />
            <LinkBtn to="/help" icon={<HelpCircle size={16} />} label="Help" />
            <button className="btn-orbit btn-orbit-ghost" style={{ color: 'var(--orbit-danger)' }} onClick={() => { logout(); window.location.href = '/' }}><LogOut size={16} /> Log out</button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function LinkBtn({ to, icon, label }) {
  return (
    <Link to={to} className="btn-orbit btn-orbit-secondary" style={{ height: 'auto', padding: '8px 14px' }}>
      {icon} {label}
    </Link>
  )
}
