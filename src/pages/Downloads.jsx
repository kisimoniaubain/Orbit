import React from 'react'
import { templates } from '../data/templates'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TemplateCard from '../components/TemplateCard'

export default function Downloads() {
  const items = templates.filter(t => t.priceType === 'free').slice(0, 3)
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '40px 24px 64px' }}>
        <h1 className="orbit-h2 mb-3">My Downloads</h1>
        <div className="row g-4">
          {items.map(t => <div className="col-md-4" key={t.id}><TemplateCard t={t} /></div>)}
        </div>
      </main>
      <Footer />
    </>
  )
}
