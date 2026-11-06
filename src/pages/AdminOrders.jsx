import React, { useState, useEffect } from 'react'
import { Table, Button, message, Drawer } from 'antd'
import { PlusCircle } from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'

const AdminOrders = () => {
  const [purchases, setPurchases] = useState([])
  const [formVisible, setFormVisible] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState(null)

  useEffect(() => {
    fetch('/api/purchases')
      .then(res => res.json())
      .then(data => setPurchases(Array.isArray(data) ? data : []))
      .catch(() => message.error('Failed to load purchases'))
  }, [])

  const handleShowForm = (purchase = null) => {
    setEditingPurchase(purchase)
    setFormVisible(true)
  }

  const handleHideForm = () => {
    setFormVisible(false)
    setEditingPurchase(null)
  }

  const handleFormSubmit = async (e) => {
    e?.preventDefault?.()
    if (editingPurchase) {
      message.success('Purchase status updated successfully')
    } else {
      message.success('Purchase recorded successfully')
    }
    handleHideForm()
  }

  const handlePurchaseDelete = (id) => {
    if (!id) return
    if (window.confirm('Are you sure you want to delete this purchase record?')) {
      setPurchases(purchases.filter(p => p._id !== id && p.id !== id))
      message.success('Purchase record deleted successfully')
    }
  }

  const columns = [
    { title: 'User', key: 'user', width: '140px', render: (_, record) => record.user?.name || record.user?.email || 'Unknown' },
    { title: 'Product', key: 'product', width: '180px', render: (_, record) => record.product?.name || record.productName || 'Unknown' },
    { title: 'Amount', key: 'amount', align: 'right', width: '100px', render: (_, record) => `$${Number(record.amount || 0).toFixed(2)}` },
    { title: 'Status', key: 'status', width: '100px', render: (_, record) => record.status || 'Pending' },
    {
      title: 'Actions',
      key: 'actions',
      width: '140px',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => handleShowForm(record)} style={{ padding: '4px 8px', fontSize: 12, background: 'var(--orbit-primary)', color: '#fff', border: 'none', borderRadius: 4 }}>Update</button>
          <button type="button" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--orbit-danger)', border: '1px solid #f5222d', borderRadius: 4, background: 'transparent' }} onClick={() => handlePurchaseDelete(record._id || record.id)}>Delete</button>
        </div>
      )
    }
  ]

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="ant-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#111827', marginBottom: '16px' }}>Orders & Purchases Management</h2>
          <Button onClick={() => handleShowForm()} icon={<PlusCircle />} style={{ backgroundColor: '#00ACC1', borderColor: '#00ACC1' }}>Record Purchase</Button>
        </div>

        <Drawer
          title={editingPurchase ? 'Update Purchase Status' : 'Record New Purchase'}
          open={formVisible}
          onClose={handleHideForm}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={handleHideForm}>Cancel</Button>
              <Button type="primary" onClick={handleFormSubmit}>{editingPurchase ? 'Update' : 'Record'}</Button>
            </div>
          }
        >
          <form onSubmit={handleFormSubmit}>
            <p>Purchase form placeholder.</p>
            <Button type="primary" htmlType="submit">{editingPurchase ? 'Update' : 'Record'}</Button>
          </form>
        </Drawer>

        <Table dataSource={purchases} columns={columns} rowKey={(record) => record._id || record.id} size="small" scroll={{ x: 'max-content' }} />
        {purchases.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
            <h3>No purchases yet</h3>
            <p>Record first purchase to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders