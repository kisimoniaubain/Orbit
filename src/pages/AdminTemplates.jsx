import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { loadProducts, deleteProduct, updateProduct } from '../lib/products'
import AdminSidebar from '../components/AdminSidebar'
import Modal from '../components/Modal'

export default function AdminTemplates() {
  const [query, setQuery] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [list, setList] = useState([])
  const reload = () => apiList()
  const apiList = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/products?includeUnpublished=1')
      const data = await res.json()
      setList(Array.isArray(data) ? data.map(p => ({ ...p, id: p.id || p._id })) : [])
    } catch { loadProducts().then(setList) }
  }
  useEffect(() => { apiList() }, [])
  const filtered = list.filter(t => (t.name || '').toLowerCase().includes(query.toLowerCase()))
  const handleDelete = (id) => { deleteProduct(id).then(() => apiList()); setToDelete(null) }
  const togglePublish = (t) => {
    updateProduct(t.id || t._id, { published: t.published === false }).then(() => apiList())
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h1 className="orbit-h2 mb-0">Products</h1>
          <Link to="/admin/add" className="btn-orbit btn-orbit-primary">Add Product</Link>
        </div>
        <input className="form-control mb-3" placeholder="Search products..." value={query} onChange={e=>setQuery(e.target.value)} style={{ maxWidth: 320 }} />
        <div className="admin-card">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr><th>Thumbnail</th><th>Name</th><th>Category</th><th>Technology</th><th>Price Type</th><th>Status</th><th>Updated</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td><img src={t.image} alt={t.name} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 6 }} onError={e => { e.target.style.display = 'none' }} /></td>
                    <td>{t.name}</td>
                    <td>{t.category}</td>
                    <td>{(t.technologies || []).join(', ')}</td>
                    <td>{t.priceType}</td>
                    <td><span className={"badge-orbit " + (t.published !== false ? 'badge-free' : 'badge-premium')}>{t.published !== false ? 'Published' : 'Draft'}</span></td>
                    <td>{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : t.updated}</td>
                    <td className="d-flex gap-1 flex-wrap">
                      <Link to={'/admin/edit/' + (t.id || t._id)} className="btn-orbit btn-orbit-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>Edit</Link>
                      <Link to={'/preview/' + (t.id || t._id)} className="btn-orbit btn-orbit-ghost" style={{ padding: '4px 8px', fontSize: 12 }}>Preview</Link>
                      <button className="btn-orbit btn-orbit-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => togglePublish(t)}>{t.published !== false ? 'Unpublish' : 'Publish'}</button>
                      <button className="btn-orbit btn-orbit-ghost" style={{ padding: '4px 8px', fontSize: 12, color: 'var(--orbit-danger)' }} onClick={()=>setToDelete(t)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Modal open={!!toDelete} onClose={()=>setToDelete(null)} title="Delete product?">
          <p className="orbit-body">This action cannot be undone. Delete {toDelete?.name}?</p>
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn-orbit btn-orbit-secondary" onClick={()=>setToDelete(null)}>Cancel</button>
            <button className="btn-orbit btn-orbit-primary" style={{ background: 'var(--orbit-danger)' }} onClick={()=>handleDelete(toDelete.id || toDelete._id)}>Delete</button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
