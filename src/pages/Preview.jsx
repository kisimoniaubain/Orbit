import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadProducts } from '../lib/products'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Monitor, Tablet, Smartphone, ExternalLink, Download, ShoppingCart } from 'lucide-react'

export default function Preview() {
  const { id } = useParams()
  const [t, setT] = useState(null)
  useEffect(() => { loadProducts().then(list => setT(list.find(x => (x.id || x._id) === id) || null)) }, [id])
  const [viewport, setViewport] = useState('desktop')
  const width = viewport === 'mobile' ? 375 : viewport === 'tablet' ? 768 : '100%'
  if (!t) return <><Navbar /><main className="container-orbit" style={{ padding: 64 }}><p className="orbit-body">Loading...</p></main><Footer /></>
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '24px 24px 64px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <Link to={`/templates/${id}`} className="orbit-small">← Back to Details</Link>
            <h1 className="orbit-h3 mb-0 mt-1">{t.name} — Live Preview</h1>
          </div>
          <div className="d-flex gap-2">
            <button className={`btn-orbit ${viewport==='desktop'?'btn-orbit-primary':'btn-orbit-secondary'}`} onClick={()=>setViewport('desktop')}><Monitor size={16}/></button>
            <button className={`btn-orbit ${viewport==='tablet'?'btn-orbit-primary':'btn-orbit-secondary'}`} onClick={()=>setViewport('tablet')}><Tablet size={16}/></button>
            <button className={`btn-orbit ${viewport==='mobile'?'btn-orbit-primary':'btn-orbit-secondary'}`} onClick={()=>setViewport('mobile')}><Smartphone size={16}/></button>
            <a className="btn-orbit btn-orbit-secondary" href={t.demoUrl || '#'} target="_blank" rel="noreferrer"><ExternalLink size={16}/> Open in New Tab</a>
            {t.downloadUrl ? <a className="btn-orbit btn-orbit-primary" href={t.downloadUrl} download><Download size={16}/> Download</a> : (t.priceType === 'free' ? <button className="btn-orbit btn-orbit-primary"><Download size={16}/> Download</button> : <button className="btn-orbit btn-orbit-primary"><ShoppingCart size={16}/> Buy</button>)}
          </div>
        </div>
        <div className="orbit-card" style={{ padding: 16, background: '#0F172A' }}>
          <div style={{ margin: '0 auto', width, maxWidth: '100%', transition: 'width .2s' }}>
            <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', minHeight: 480 }}>
              <iframe title="preview" src={t.demoUrl || 'about:blank'} style={{ width: '100%', height: 600, border: 'none' }} />
              {!t.demoUrl && (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--orbit-text-muted)' }}>
                  Demo preview will render here from a separately hosted site.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
