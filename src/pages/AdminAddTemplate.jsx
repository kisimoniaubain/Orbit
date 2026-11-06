import React, { useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { Upload, Save, Rocket } from 'lucide-react'
import { addProduct } from '../lib/products'

export default function AdminAddTemplate() {
  const [form, setForm] = useState({
    name: '', slug: '', description: '', category: 'SaaS', tech: 'React, Bootstrap',
    priceType: 'free', price: '', version: '1.0.0', license: 'MIT', featured: false,
    status: 'draft', previewUrl: '', docsUrl: '', downloadUrl: '',
  })
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const saveDraft = () => { setToast('Draft saved'); setTimeout(() => setToast(''), 2000) }
  const publish = () => {
    setProgress(0)
    const t = setInterval(() => setProgress(p => {
      if (p >= 100) {
        clearInterval(t)
        const product = {
          id: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
          name: form.name || 'Untitled',
          tagline: form.description?.slice(0, 60) || '',
          description: form.description,
          category: form.category,
          categoryId: form.category.toLowerCase().replace(/\s+/g, '-'),
          technologies: form.tech.split(',').map(s => s.trim()).filter(Boolean),
          priceType: form.priceType,
          price: form.priceType === 'premium' ? Number(form.price) || 0 : 0,
          rating: 0,
          reviews: 0,
          downloads: 0,
          version: form.version,
          updated: new Date().toISOString().slice(0, 10),
          license: form.license,
          responsive: true,
          featured: form.featured,
           published: form.status === 'published',
          tags: [],
          demoUrl: form.previewUrl,
           downloadUrl: form.downloadUrl,
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=560&fit=crop',
        }
        addProduct(product).then(() => { setToast('Published'); setTimeout(() => setToast(''), 2000) }).catch(() => { setToast('Failed'); setTimeout(() => setToast(''), 2000) })
        return 100
      }
      return p + 10
    }), 200)
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="orbit-h2 mb-4">Add / Edit Template</h1>
        <div className="admin-card">
          <form className="form-orbit">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Template Name</label>
                <input className="form-control" value={form.name} onChange={e=>set('name',e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Slug</label>
                <input className="form-control" value={form.slug} onChange={e=>set('slug',e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e=>set('description',e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e=>set('category',e.target.value)}>
                  <option>SaaS</option><option>Portfolio</option><option>Business</option><option>E-commerce</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Technology</label>
                <input className="form-control" value={form.tech} onChange={e=>set('tech',e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Free or Premium</label>
                <select className="form-select" value={form.priceType} onChange={e=>set('priceType',e.target.value)}>
                  <option value="free">Free</option><option value="premium">Premium</option>
                </select>
              </div>
              {form.priceType === 'premium' && (
                <div className="col-md-3">
                  <label className="form-label">Price</label>
                  <input type="number" className="form-control" value={form.price} onChange={e=>set('price',e.target.value)} />
                </div>
              )}
              <div className="col-md-3">
                <label className="form-label">Version</label>
                <input className="form-control" value={form.version} onChange={e=>set('version',e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">License</label>
                <input className="form-control" value={form.license} onChange={e=>set('license',e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e=>set('status',e.target.value)}>
                  <option value="draft">Draft</option><option value="published">Published</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Live Preview URL</label>
                <input className="form-control" value={form.previewUrl} onChange={e=>set('previewUrl',e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Documentation URL</label>
              <div className="col-md-6">
                <label className="form-label">Download URL</label>
                <input className="form-control" value={form.downloadUrl} onChange={e=>set('downloadUrl',e.target.value)} placeholder="/uploads/..." />
              </div>
                <input className="form-control" value={form.docsUrl} onChange={e=>set('docsUrl',e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label">Main Screenshot Upload</label>
                <input type="file" className="form-control" />
              </div>
              <div className="col-12">
                <label className="form-label">Additional Screenshots</label>
                <input type="file" multiple className="form-control" />
              </div>
              <div className="col-12">
                <label className="form-label">ZIP Source-code Upload</label>
                <input type="file" className="form-control" />
              </div>
              <div className="col-12">
                <label className="filter-option">
                  <input type="checkbox" checked={form.featured} onChange={e=>set('featured',e.target.checked)} /> Featured template
                </label>
              </div>
            </div>
            {progress > 0 && (
              <div className="mt-3">
                <div className="progress" style={{ height: 8 }}>
                  <div className="progress-bar" style={{ width: progress + '%', background: 'var(--orbit-primary)' }} />
                </div>
                <div className="orbit-small mt-1">Upload progress: {progress}%</div>
              </div>
            )}
            <div className="d-flex gap-2 mt-4">
              <button type="button" className="btn-orbit btn-orbit-secondary" onClick={saveDraft}><Save size={16}/> Save Draft</button>
              <button type="button" className="btn-orbit btn-orbit-primary" onClick={publish}><Rocket size={16}/> Publish</button>
            </div>
          </form>
        </div>
        <p className="orbit-small mt-3">Publishing and uploading require server-side authorization.</p>
        {toast && <div className="orbit-toast">{toast}</div>}
      </div>
    </div>
  )
}

