import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Layers, PlusCircle, FolderTree, ShoppingBag, Users, Star, BarChart3, Bell, Settings, User, LogOut, Menu, X } from 'lucide-react'
import { logout } from '../lib/auth'

const groups = [
  { title: 'Main', items: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/templates', label: 'Products', icon: Layers },
    { to: '/admin/add', label: 'Add Product', icon: PlusCircle },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/orders', label: 'Orders & Purchases', icon: ShoppingBag },
    { to: '/admin/users', label: 'Users', icon: Users },
  ]},
  { title: 'Marketplace', items: [
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  ]},
  { title: 'Administration', items: [
    { to: '/admin/settings', label: 'Settings', icon: Settings },
    { to: '/profile', label: 'Admin Profile', icon: User },
  ]},
]

export default function AdminSidebar() {
  const loc = useLocation()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const content = (
    <aside className="admin-sidebar">
      <Link to="/" className="orbit-logo mb-4 px-2"><img src="/logo.png" alt="ORBIT logo" style={{ width: 56, height: 56, borderRadius: 9, objectFit: 'cover' }} /></Link>
      {groups.map(g => (
        <div key={g.title} className="mb-3">
          <div className="orbit-small px-2 mb-1" style={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>{g.title}</div>
          <nav className="d-flex flex-column gap-1">
            {g.items.map(it => {
              const Icon = it.icon
              const active = loc.pathname === it.to
              return (
                <Link key={it.to} to={it.to} className={active ? 'active' : ''} onClick={() => setOpen(false)}>
                  <Icon size={18} /> {it.label}
                </Link>
              )
            })}
          </nav>
        </div>
      ))}
      <button className="btn-orbit btn-orbit-ghost mt-2" style={{ justifyContent: 'flex-start', color: 'var(--orbit-danger)' }} onClick={() => { logout(); nav('/') }}>
        <LogOut size={18} /> Logout
      </button>
    </aside>
  )
  return (
    <>
      <button className="btn-orbit btn-orbit-ghost d-lg-none" style={{ position: 'fixed', top: 12, left: 12, zIndex: 60 }} onClick={() => setOpen(o => !o)} aria-label="Menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className="d-none d-lg-block">{content}</div>
      {open && <div className="d-lg-none" style={{ position: 'fixed', inset: 0, zIndex: 55, background: 'rgba(0,0,0,0.6)' }} onClick={() => setOpen(false)}>{content}</div>}
    </>
  )
}




