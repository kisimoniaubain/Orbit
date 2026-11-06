import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { loadProducts } from '../lib/products'
import { addToCart } from '../lib/cart'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/Breadcrumbs'
import { PricingBadge, TechBadge } from '../components/TemplateCard'
import { Eye, Download, ShoppingCart } from 'lucide-react'

export default function TemplateDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [t, setT] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadProducts().then(list => {
      const found = list.find(x => x.id === id || x._id === id)
      setT(found || null)
      if (found) setRelated(list.filter(x => x.id !== found.id && x.categoryId === found.categoryId).slice(0, 3))
      setLoading(false)
    })
  }, [id])
  if (loading) return <><Navbar /><main className="container-orbit" style={{ padding: 64 }}><p className="orbit-body">Loading...</p></main><Footer /></>
  if (!t) return <><Navbar /><main className="container-orbit" style={{ padding: '96px 24px', textAlign: 'center' }}><h1 className="orbit-h1 mb-2">Product not found</h1><Link to="/templates" className="btn-orbit btn-orbit-primary">Back</Link></main><Footer /></>
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '32px 24px 64px' }}>
        <Breadcrumbs items={[{label:'Home',to:'/'},{label:'Templates',to:'/templates'},{label:t.category,to:'/templates'},{label:t.name}]} />
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="orbit-card" style={{ overflow: 'hidden', marginBottom: 24 }}>
              <img src={t.image} alt={t.name} style={{ width: '100%', height: 420, objectFit: 'cover' }} />
            </div>
            <h1 className="orbit-h2 mb-1">{t.name}</h1>
            <p className="orbit-body mb-3">{t.description}</p>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <PricingBadge type={t.priceType} />
              {(t.technologies || []).map(x => <TechBadge key={x} tech={x} />)}
            </div>
            <section className="mb-4">
              <h3 className="orbit-h3 mb-2">Overview</h3>
              <p className="orbit-body">{t.description}</p>
            </section>
            <section className="mb-4">
              <h3 className="orbit-h3 mb-2">Installation</h3>
              <pre style={{ background: '#1F1F1F', padding: 12, borderRadius: 8, fontSize: 13, color: '#F7F7F7' }}>npm install{'\n'}npm run dev</pre>
            </section>
            <section className="mb-4">
              <h3 className="orbit-h3 mb-2">License</h3>
              <p className="orbit-small">{t.license} license.</p>
            </section>
          </div>
          <div className="col-lg-4">
            <div className="orbit-card" style={{ padding: 20, position: 'sticky', top: 80 }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <PricingBadge type={t.priceType} />
                {t.priceType === 'premium' && <span style={{ fontSize: 24, fontWeight: 800 }}>${t.price}</span>}
              </div>
              <div className="orbit-small mb-3">Version {t.version} · Updated {t.updated}</div>
              <div className="d-grid gap-2">
                <Link to={`/preview/${t.id || t._id}`} className="btn-orbit btn-orbit-secondary"><Eye size={16} /> Live Preview</Link>
                {t.priceType === 'free' ? (
                  <a href={t.downloadUrl || '#'} className="btn-orbit btn-orbit-primary" download><Download size={16} /> Free Download</a>
                ) : (
                  <button className="btn-orbit btn-orbit-primary" onClick={() => { addToCart(t); navigate('/cart') }}><ShoppingCart size={16} /> Buy Template</button>
                )}
              </div>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <section className="mt-5">
            <h2 className="orbit-h2 mb-3">Related Templates</h2>
            <div className="row g-4">
              {related.map(t => (
                <div className="col-md-4" key={t.id || t._id}>
                  <TemplateCard t={t} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}