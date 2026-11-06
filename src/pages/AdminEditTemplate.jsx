import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import { api } from '../lib/api'
import { updateProduct } from '../lib/products'

export default function AdminEditTemplate() {
  const { id } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  useEffect(() => {
    api('/api/products/' + id).then(p => {
      setForm({
        name: p.name || '', slug: p.id || p._id, description: p.description || '', category: p.category || 'SaaS',
        tech: (p.technologies || []).join(', '), priceType: p.priceType || 'free', price: p.price || '',
        version: p.version || '1.0.0', license: p.license || 'MIT', featured: !!p.featured,
        status: p.published !== false ? 'published' : 'draft', previewUrl: p.demoUrl || '',
        downloadUrl: p.downloadUrl || '',
        image: p.image || '',
      })
    }).finally(() => setLoading(false))
  }, [id])
  if (loading || !form) return <div className="admin-layout"><AdminSidebar /><div className="admin-content"><p>Loading...</p></div></div>
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const save = async () => {
    try {
      await updateProduct(id, {
        name: form.name,
        description: form.description,
        category: form.category,
        categoryId: form.category.toLowerCase().replace(/\s+/g, '-'),
        technologies: form.tech.split(',').map(s => s.trim()).filter(Boolean),
        priceType: form.priceType,
        price: form.priceType === 'premium' ? Number(form.price) || 0 : 0,
        version: form.version,
        license: form.license,
        featured: form.featured,
        published: form.status === 'published',
        demoUrl: form.previewUrl,
        image: form.image,
      })
      setToast('Saved'); setTimeout(() => setToast(''), 2000)
    } catch (e) { setToast('Failed: ' + e.message); setTimeout(() => setToast(''), 3000) }
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="orbit-h2 mb-4">Edit Product</h1>
        <div className="admin-card">
          <form className="form-orbit">
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label">Template Name</label><input className="form-control" value={form.name} onChange={e=>set('name',e.target.value)} /></div>
              <div className="col-md-6"><label className="form-label">Image URL</label><input className="form-control" value={form.image} onChange={e=>set('image',e.target.value)} /></div>
              <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e=>set('description',e.target.value)} /></div>
              <div className="col-md-4"><label className="form-label">Category</label><input className="form-control" value={form.category} onChange={e=>set('category',e.target.value)} /></div>
              <div className="col-md-4"><label className="form-label">Tech (comma)</label><input className="form-control" value={form.tech} onChange={e=>set('tech',e.target.value)} /></div>
              <div className="col-md-4"><label className="form-label">Price Type</label><select className="form-select" value={form.priceType} onChange={e=>set('priceType',e.target.value)}><option value="free">Free</option><option value="premium">Premium</option></select></div>
              {form.priceType === 'premium' && <div className="col-md-3"><label className="form-label">Price</label><input type="number" className="form-control" value={form.price} onChange={e=>set('price',e.target.value)} /></div>}
              <div className="col-md-3"><label className="form-label">Version</label><input className="form-control" value={form.version} onChange={e=>set('version',e.target.value)} /></div>
              <div className="col-md-3"><label className="form-label">License</label><input className="form-control" value={form.license} onChange={e=>set('license',e.target.value)} /></div>
              <div className="col-md-3"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e=>set('status',e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></div>
              <div className="col-md-6"><label className="form-label">Live Preview URL</label><input className="form-control" value={form.previewUrl} onChange={e=>set('previewUrl',e.target.value)} /></div>
              <div className="col-md-6"><label className="form-label">Download URL</label><input className="form-control" value={form.downloadUrl} onChange={e=>set('downloadUrl',e.target.value)} /></div>
              <div className="col-12"><label className="filter-option"><input type="checkbox" checked={form.featured} onChange={e=>set('featured',e.target.checked)} /> Featured</label></div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="button" className="btn-orbit btn-orbit-primary" onClick={save}>Save Changes</button>
              <button type="button" className="btn-orbit btn-orbit-secondary" onClick={() => nav('/admin/templates')}>Back</button>
            </div>
          </form>
        </div>
        {toast && <div className="orbit-toast">{toast}</div>}
      </div>
    </div>
  )
}