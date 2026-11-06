import React, { useState, useEffect } from 'react'
import { loadProducts } from '../lib/products'
import { categories } from '../data/templates'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TemplateCard from '../components/TemplateCard'
import { Search } from 'lucide-react'

export default function Home() {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [all, setAll] = useState([])
  useEffect(() => { loadProducts().then(setAll) }, [])
  const filtered = all.filter(t => {
    if (tab !== 'all' && t.categoryId !== tab) return false
    if (search && !(t.name + t.tagline).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })
  const scrollImages = (all.length ? all : []).map(t => t.image)
  return (
    <>
      <Navbar />
      <main>
        <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px 80px', textAlign: 'center', minHeight: 520 }}>
          <div className="scroll-bg" aria-hidden="true">
            {scrollImages.concat(scrollImages).map((src, i) => (
              <img key={i} src={src} alt="" />
            ))}
          </div>
          <div className="scroll-overlay" aria-hidden="true" />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="orbit-eyebrow mb-3">Premium design marketplace</div>
            <h1 className="orbit-h1 mb-3" style={{ maxWidth: 900, margin: '0 auto 16px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Discover premium UI kits, templates, and design resources
            </h1>
            <p className="orbit-body mb-4" style={{ maxWidth: 640, margin: '0 auto 24px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Tailored for designers, developers, and startups. Browse, preview, and download.
            </p>
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              <div className="position-relative">
                <Search size={18} style={{ position: 'absolute', left: 18, top: 16, color: 'var(--orbit-text-muted)' }} />
                <input className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates, categories, or technologies..." style={{ paddingLeft: 46, height: 52, borderRadius: 999 }} />
              </div>
            </div>
          </div>
        </section>

        <section className="container-orbit" style={{ padding: '0 24px 24px' }}>
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <button className={`btn-orbit ${tab === 'all' ? 'btn-orbit-primary' : 'btn-orbit-secondary'}`} style={{ height: 'auto', padding: '8px 18px' }} onClick={() => setTab('all')}>All</button>
            {categories.map(c => (
              <button key={c.id} className={`btn-orbit ${tab === c.id ? 'btn-orbit-primary' : 'btn-orbit-secondary'}`} style={{ height: 'auto', padding: '8px 18px' }} onClick={() => setTab(c.id)}>{c.name}</button>
            ))}
          </div>
        </section>

        <section className="container-orbit" style={{ padding: '0 24px 80px' }}>
          <div className="row g-4">
            {filtered.map(t => (
              <div className="col-12 col-sm-6 col-lg-3" key={t.id}>
                <TemplateCard t={t} />
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state"><h3>No results</h3><p>Try a different tab or search.</p></div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
