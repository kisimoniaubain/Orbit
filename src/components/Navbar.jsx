import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X, Rocket, User, LogOut, Heart } from 'lucide-react'
import { getUser, logout, refreshUser, isAdmin } from '../lib/auth'
import { getFavorites } from '../lib/favorites'
import { gravatarUrl } from '../lib/gravatar'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [userTick, setUserTick] = useState(0)
  useEffect(() => { if (getUser()) refreshUser().then(() => setUserTick(t => t + 1)) }, [])
  const loc = useLocation()
  const links = [
    { to: '/templates', label: 'Templates' },
    { to: '/categories', label: 'Categories' },
    { to: '/free', label: 'Free Templates' },
    { to: '/premium', label: 'Premium' },
  ]
  return (
    <nav className="orbit-nav">
      <div className="container-orbit orbit-nav-inner">
        <Link to="/" className="orbit-logo">
          <img src="/logo.png" alt="ORBIT logo" style={{ width: 94, height: 94, borderRadius: 9, objectFit: 'cover' }} />
        </Link>
        <div className="d-none d-lg-flex align-items-center gap-4">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{ fontWeight: 500, fontSize: 14, color: loc.pathname === l.to ? 'var(--orbit-primary)' : 'var(--orbit-text-muted)' }}>
              {l.label}
            </Link>
          ))}
          {isAdmin() && (
            <Link to="/admin" style={{ fontWeight: 500, fontSize: 14, color: loc.pathname.startsWith('/admin') ? 'var(--orbit-primary)' : 'var(--orbit-text-muted)' }}>
              Admin
            </Link>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn-orbit btn-orbit-ghost" onClick={() => setSearchOpen(s => !s)} aria-label="Search">
            <Search size={25} />
          </button>
          {getUser() ? (
            <>
              <Link to="/favorites" className="btn-orbit btn-orbit-ghost" title="My Favorites"><i className="bi bi-heart" style={{ fontSize: 25 }}></i> {getFavorites().length}</Link>
              <Link to="/cart" className="btn-orbit btn-orbit-ghost" title="Cart"><i className="bi bi-cart4" style={{ fontSize: 28 }}></i></Link>
              <div style={{ position: 'relative' }}>
                <button className="btn-orbit btn-orbit-ghost" onClick={() => setAvatarOpen(o => !o)} style={{ padding: 0, height: 'auto' }}>
                  {getUser()?.avatarUrl ? (
                    <img src={getUser().avatarUrl} alt="avatar" referrerPolicy="no-referrer" style={{ width: 40, height: 40, borderRadius: '50%', display: 'block', border: '2px solid var(--orbit-primary)' }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--orbit-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, border: '2px solid var(--orbit-primary)' }}>
                      {(getUser()?.name || getUser()?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                {avatarOpen && (
                  <div className="orbit-card" style={{ position: 'absolute', right: 0, top: 44, minWidth: 180, padding: 6, zIndex: 100, background: 'var(--orbit-surface)', border: '1px solid var(--orbit-border)', boxShadow: 'var(--orbit-shadow-lg)' }}>
                    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--orbit-border)', marginBottom: 4 }}>
                      <div style={{ fontWeight: 600 }}>{getUser()?.name}</div>
                      <div className="orbit-small">{getUser()?.email}</div>
                    </div>
                    {isAdmin() && <Link to="/admin" className="d-block px-3 py-2 rounded" style={{ color: 'var(--orbit-text)' }} onClick={() => setAvatarOpen(false)}>Admin Dashboard</Link>}
                    <Link to="/profile" className="d-block px-3 py-2 rounded" style={{ color: 'var(--orbit-text)' }} onClick={() => setAvatarOpen(false)}>Profile</Link>
                    <Link to="/purchases" className="d-block px-3 py-2 rounded" style={{ color: 'var(--orbit-text)' }} onClick={() => setAvatarOpen(false)}>Purchases</Link>
                    <Link to="/settings" className="d-block px-3 py-2 rounded" style={{ color: 'var(--orbit-text)' }} onClick={() => setAvatarOpen(false)}>Setting</Link>
                    <button className="d-block px-3 py-2 w-100 text-start rounded" style={{ border: 'none', background: 'transparent', color: 'var(--orbit-danger)' }} onClick={() => { logout(); window.location.href = '/' }}>Sign out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-orbit btn-orbit-secondary d-none d-md-inline-flex">Sign In</Link>
              <Link to="/register" className="btn-orbit btn-orbit-primary d-none d-md-inline-flex">Sign Up</Link>
            </>
          )}
          <button className="btn-orbit btn-orbit-ghost d-lg-none" onClick={() => setOpen(s => !s)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="container-orbit pb-3">
          <div className="position-relative">
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--orbit-text-muted)' }} />
            <input className="form-control" placeholder="Search templates, categories, or technologies..." style={{ paddingLeft: 36, borderRadius: 'var(--orbit-radius-sm)' }} />
          </div>
        </div>
      )}
      {open && (
        <div className="d-lg-none border-top" style={{ background: 'var(--orbit-surface)' }}>
          <div className="container-orbit py-3 d-flex flex-column gap-2">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{ padding: '8px 0', fontWeight: 500 }}>
                {l.label}
              </Link>
            ))}
            <Link to="/signin" onClick={() => setOpen(false)} className="btn-orbit btn-orbit-secondary mt-2">Sign In</Link>
          </div>
        </div>
      )}
    </nav>
  )
}



