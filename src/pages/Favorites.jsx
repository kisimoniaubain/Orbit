import React, { useState, useEffect } from 'react'
import { loadProducts } from '../lib/products'
import { getFavorites } from '../lib/favorites'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TemplateCard from '../components/TemplateCard'

export default function Favorites() {
  const [items, setItems] = useState([])
  useEffect(() => {
    loadProducts().then(list => {
      const favIds = getFavorites()
      setItems(list.filter(t => favIds.includes(t.id || t._id)))
    })
  }, [])
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '40px 24px 64px' }}>
        <h1 className="orbit-h2 mb-3">Saved Templates</h1>
        {items.length === 0 ? (
          <div className="empty-state"><h3>No saved templates</h3><p>Tap the heart on a product to save it.</p></div>
        ) : (
          <div className="row g-4">
            {items.map(t => <div className="col-md-4" key={t.id || t._id}><TemplateCard t={t} /></div>)}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
