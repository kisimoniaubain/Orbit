import React, { useState } from 'react'
import { getUser } from '../lib/auth'
import { gravatarUrl } from '../lib/gravatar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Save, Trash2 } from 'lucide-react'

const TABS = [
  'Profile',
  'Security',
  'Notifications',
  'Appearance',
  'Purchases',
  'Saved Items',
  'Billing',
  'Privacy',
]

export default function Settings() {
  const u = getUser()
  const [tab, setTab] = useState('Profile')
  const [toast, setToast] = useState('')
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2000) }

  const [profile, setProfile] = useState({
    name: u?.name || '',
    displayName: u?.name || '',
    username: (u?.email || '').split('@')[0],
    email: u?.email || '',
    bio: '',
    website: '',
  })
  const setP = (k, v) => setProfile(p => ({ ...p, [k]: v }))

  const [prefs, setPrefs] = useState({
    theme: 'dark', density: 'comfortable', language: 'English', defaultCategory: 'All', defaultSort: 'Recommended',
    notifyProducts: true, notifyReceipts: true, notifyDownloads: true, notifyRecommendations: true, notifyAnnouncements: false,
  })
  const setPref = (k, v) => setPrefs(p => ({ ...p, [k]: v }))

  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '40px 24px 64px' }}>
        <h1 className="orbit-h2 mb-3">Settings</h1>
        <div className="row g-4">
          <div className="col-md-3">
            <div className="orbit-card" style={{ padding: 8 }}>
              {TABS.map(t => (
                <button key={t} className={`btn-orbit w-100 text-start mb-1 ${tab === t ? 'btn-orbit-primary' : 'btn-orbit-ghost'}`} style={{ height: 'auto', padding: '8px 12px', justifyContent: 'flex-start' }} onClick={() => setTab(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-9">
            <div className="orbit-card" style={{ padding: 24 }}>
              {tab === 'Profile' && (
                <div className="form-orbit">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <img src={gravatarUrl(u?.email)} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%' }} />
                    <button className="btn-orbit btn-orbit-secondary" style={{ height: 'auto', padding: '6px 12px' }}>Change picture</button>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label">Full name</label><input className="form-control" value={profile.name} onChange={e => setP('name', e.target.value)} /></div>
                    <div className="col-md-6"><label className="form-label">Display name</label><input className="form-control" value={profile.displayName} onChange={e => setP('displayName', e.target.value)} /></div>
                    <div className="col-md-6"><label className="form-label">Username</label><input className="form-control" value={profile.username} onChange={e => setP('username', e.target.value)} /></div>
                    <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" value={profile.email} onChange={e => setP('email', e.target.value)} /></div>
                    <div className="col-12"><label className="form-label">Bio</label><textarea className="form-control" rows={3} value={profile.bio} onChange={e => setP('bio', e.target.value)} /></div>
                    <div className="col-12"><label className="form-label">Website</label><input className="form-control" value={profile.website} onChange={e => setP('website', e.target.value)} /></div>
                  </div>
                  <button className="btn-orbit btn-orbit-primary mt-3" onClick={() => notify('Profile saved')}><Save size={16} /> Save changes</button>
                </div>
              )}

              {tab === 'Security' && (
                <div className="form-orbit">
                  <h3 className="orbit-h3 mb-3">Change password</h3>
                  <div className="mb-3"><label className="form-label">Current password</label><input type="password" className="form-control" /></div>
                  <div className="mb-3"><label className="form-label">New password</label><input type="password" className="form-control" /></div>
                  <div className="mb-3"><label className="form-label">Confirm new password</label><input type="password" className="form-control" /></div>
                  <button className="btn-orbit btn-orbit-primary mb-4" onClick={() => notify('Password updated')}>Update password</button>
                  <h3 className="orbit-h3 mb-2">Two-factor authentication</h3>
                  <p className="orbit-small mb-3">Enable 2FA for extra security (backend required).</p>
                  <button className="btn-orbit btn-orbit-secondary mb-4" onClick={() => notify('2FA setup started')}>Enable 2FA</button>
                  <h3 className="orbit-h3 mb-2">Sessions</h3>
                  <p className="orbit-small mb-3">Log out from other devices.</p>
                  <button className="btn-orbit btn-orbit-secondary mb-4" onClick={() => notify('Other sessions revoked')}>Log out other devices</button>
                  <h3 className="orbit-h3 mb-2">Delete account</h3>
                  <button className="btn-orbit btn-orbit-ghost" style={{ color: 'var(--orbit-danger)' }} onClick={() => notify('Account deletion requested')}><Trash2 size={16} /> Delete account</button>
                </div>
              )}

              {tab === 'Notifications' && (
                <div className="form-orbit">
                  {[
                    ['notifyProducts', 'Product updates'],
                    ['notifyReceipts', 'Purchase receipts'],
                    ['notifyDownloads', 'Download availability'],
                    ['notifyRecommendations', 'Product recommendations'],
                    ['notifyAnnouncements', 'Marketplace announcements'],
                  ].map(([k, label]) => (
                    <label key={k} className="filter-option mb-2">
                      <input type="checkbox" checked={prefs[k]} onChange={e => setPref(k, e.target.checked)} /> {label}
                    </label>
                  ))}
                  <button className="btn-orbit btn-orbit-primary mt-3" onClick={() => notify('Preferences saved')}><Save size={16} /> Save</button>
                </div>
              )}

              {tab === 'Appearance' && (
                <div className="form-orbit">
                  <div className="mb-3"><label className="form-label">Theme</label>
                    <select className="form-select" value={prefs.theme} onChange={e => setPref('theme', e.target.value)}>
                      <option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option>
                    </select>
                  </div>
                  <div className="mb-3"><label className="form-label">Density</label>
                    <select className="form-select" value={prefs.density} onChange={e => setPref('density', e.target.value)}>
                      <option value="comfortable">Comfortable</option><option value="compact">Compact</option>
                    </select>
                  </div>
                  <div className="mb-3"><label className="form-label">Language</label>
                    <select className="form-select" value={prefs.language} onChange={e => setPref('language', e.target.value)}>
                      <option>English</option>
                    </select>
                  </div>
                  <div className="mb-3"><label className="form-label">Default category</label>
                    <select className="form-select" value={prefs.defaultCategory} onChange={e => setPref('defaultCategory', e.target.value)}>
                      <option>All</option><option>Templates</option><option>UI Kits</option>
                    </select>
                  </div>
                  <div className="mb-3"><label className="form-label">Default sort</label>
                    <select className="form-select" value={prefs.defaultSort} onChange={e => setPref('defaultSort', e.target.value)}>
                      <option>Recommended</option><option>Newest</option><option>Price Low to High</option>
                    </select>
                  </div>
                  <button className="btn-orbit btn-orbit-primary mt-2" onClick={() => notify('Appearance saved')}><Save size={16} /> Save</button>
                </div>
              )}

              {tab === 'Purchases' && (
                <div>
                  <p className="orbit-body">Order history, purchased templates, download history, licenses, invoices, and refunds will appear here when connected to a backend.</p>
                </div>
              )}

              {tab === 'Saved Items' && (
                <div>
                  <p className="orbit-body">Manage saved templates and favorites. Visit <a href="/favorites" style={{ color: 'var(--orbit-primary)' }}>Saved Templates</a>.</p>
                </div>
              )}

              {tab === 'Billing' && (
                <div>
                  <p className="orbit-body">Billing details, payment methods, transactions, and subscriptions will appear here when payment integration is configured.</p>
                </div>
              )}

              {tab === 'Privacy' && (
                <div className="form-orbit">
                  <label className="filter-option mb-2"><input type="checkbox" /> Profile visibility</label>
                  <label className="filter-option mb-2"><input type="checkbox" /> Marketing consent</label>
                  <div className="mt-3"><button className="btn-orbit btn-orbit-secondary" onClick={() => notify('Data export requested')}>Export my data</button></div>
                  <div className="mt-2"><button className="btn-orbit btn-orbit-ghost" style={{ color: 'var(--orbit-danger)' }} onClick={() => notify('Deletion requested')}><Trash2 size={16} /> Request account deletion</button></div>
                </div>
              )}
            </div>
          </div>
        </div>
        {toast && <div className="orbit-toast">{toast}</div>}
      </main>
      <Footer />
    </>
  )
}

