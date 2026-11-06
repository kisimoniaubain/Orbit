import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api } from '../lib/api'
import { Download } from 'lucide-react'

export default function Purchases() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api('/api/purchases/mine').then(setPurchases).catch(() => setPurchases([])).finally(() => setLoading(false))
  }, [])
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '40px 24px 64px' }}>
        <h1 className="orbit-h2 mb-3">My Purchases</h1>
        {loading && <p className="orbit-body">Loading...</p>}
        {!loading && purchases.length === 0 && <div className="orbit-card" style={{ padding: 24 }}><p className="orbit-body">No purchases yet. Browse templates to buy.</p><Link to="/templates" className="btn-orbit btn-orbit-primary">Browse Templates</Link></div>}
        <div className="row g-4">
          {purchases.map(p => (
            <div className="col-md-4" key={p._id}>
              <div className="orbit-card" style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.productName || p.product?.name}</div>
                <div className="orbit-small mb-2">{p.amount ? '$' + p.amount : 'Free'} · {new Date(p.createdAt).toLocaleDateString()}</div>
                {p.product?.image && <img src={p.product.image} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                <a href="/uploads/orbit-sample-template.zip" className="btn-orbit btn-orbit-primary w-100" download><Download size={14} /> Download</a>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
