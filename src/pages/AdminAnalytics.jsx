import React, { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { api } from '../lib/api'

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { api('/api/admin/stats').then(setStats).finally(() => setLoading(false)) }, [])
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="orbit-h2 mb-1">Analytics</h1>
        <p className="orbit-body mb-4">Marketplace overview.</p>
        {loading && <p>Loading...</p>}
        {stats && (
          <div className="row g-3">
            {[
              { label: 'Users', value: stats.users },
              { label: 'Products', value: stats.products },
              { label: 'Published', value: stats.published },
              { label: 'Purchases', value: stats.purchases },
              { label: 'Revenue', value: '$' + (stats.revenue || 0) },
              { label: 'Reviews', value: stats.reviews },
            ].map(s => (
              <div className="col-md-4 col-xl-2" key={s.label}>
                <div className="admin-card">
                  <div className="orbit-small">{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}