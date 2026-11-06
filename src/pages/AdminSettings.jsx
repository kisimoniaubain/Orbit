import React from 'react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminSettings() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="orbit-h2 mb-1">Settings</h1>
        <p className="orbit-body mb-4">Marketplace configuration (read-only).</p>
        <div className="admin-card">
          <p className="orbit-body">Environment variables and secrets are managed on the server. Contact the developer to update configuration.</p>
          <ul className="orbit-small" style={{ paddingLeft: 18 }}>
            <li>API base: configured via VITE_API_URL</li>
            <li>Auth: JWT-based, admin role required for admin endpoints</li>
            <li>Database: MongoDB</li>
          </ul>
        </div>
      </div>
    </div>
  )
}