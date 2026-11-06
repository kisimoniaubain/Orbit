import React from 'react'
import AdminSidebar from '../components/AdminSidebar'

const AdminConsole = () => {
  return (
    <div className="admin-page">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="orbit-h2">Admin Console</h1>
        <p className="orbit-body">Admin console page</p>
      </div>
    </div>
  )
}

export default AdminConsole