import React, { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { api } from '../lib/api'
import { Layers, CheckCircle, FileEdit, Gift, DollarSign, Download, Users, ShoppingBag } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([
      api('/api/admin/stats'),
      api('/api/products?includeUnpublished=1'),
    ]).then(([s, p]) => { setStats(s); setProducts(Array.isArray(p) ? p : []) }).finally(() => setLoading(false))
  }, [])
  const published = products.filter(p => p.published !== false).length
  const unpublished = products.length - published
  const cards = stats ? [
    { label: 'Total Users', value: stats.users, icon: Users },
    { label: 'Total Products', value: stats.products, icon: Layers },
    { label: 'Published', value: published, icon: CheckCircle },
    { label: 'Unpublished', value: unpublished, icon: FileEdit },
    { label: 'Purchases', value: stats.purchases, icon: ShoppingBag },
    { label: 'Revenue', value: '$' + (stats.revenue || 0), icon: DollarSign },
  ] : []
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="orbit-h2 mb-1">Overview</h1>
        <p className="orbit-body mb-4">Real-time marketplace statistics.</p>
        {loading && <p>Loading...</p>}
        <div className="row g-3 mb-4">
          {cards.map(s => {
            const Icon = s.icon
            return (
              <div className="col-md-4 col-xl-2" key={s.label}>
                <div className="admin-card">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="orbit-small">{s.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
                    </div>
                    <Icon size={20} color="var(--orbit-primary)" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="admin-card mb-4">
              <h3 className="orbit-h3 mb-3">Recent Purchases</h3>
              <table className="table">
                <thead><tr><th>Product</th><th>Customer</th><th>Amount</th><th>Date</th></tr></thead>
                <tbody>
                  {(stats?.recentPurchases || []).map(p => (
                    <tr key={p._id}>
                      <td>{p.productName || p.product?.name || '—'}</td>
                      <td>{p.user?.name || p.user?.email || '—'}</td>
                      <td>{p.amount ? '$' + p.amount : 'Free'}</td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {!loading && (stats?.recentPurchases || []).length === 0 && <tr><td colSpan={4} className="text-center orbit-small">No purchases yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="admin-card mb-4">
              <h3 className="orbit-h3 mb-3">Recently Registered Users</h3>
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {(stats?.recentUsers || []).map(u => (
                    <tr key={u._id}>
                      <td>{u.name || '—'}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {!loading && (stats?.recentUsers || []).length === 0 && <tr><td colSpan={4} className="text-center orbit-small">No users yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <h3 className="orbit-h3 mb-3">Recent Products</h3>
          <table className="table">
            <thead><tr><th>Name</th><th>Category</th><th>Status</th><th>Updated</th></tr></thead>
            <tbody>
              {products.slice(0, 5).map(t => (
                <tr key={t._id || t.id}>
                  <td>{t.name}</td>
                  <td>{t.category}</td>
                  <td><span className={"badge-orbit " + (t.published !== false ? 'badge-free' : 'badge-premium')}>{t.published !== false ? 'Published' : 'Draft'}</span></td>
                  <td>{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : t.updated}</td>
                </tr>
              ))}
              {!loading && products.length === 0 && <tr><td colSpan={4} className="text-center orbit-small">No products yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
