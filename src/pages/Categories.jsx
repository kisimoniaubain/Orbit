import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CategoryCard from '../components/CategoryCard'
import { categories } from '../data/templates'

export default function Categories() {
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '40px 24px 64px' }}>
        <h1 className="orbit-h2 mb-3">Categories</h1>
        <div className="row g-3">
          {categories.map(c => <div className="col-6 col-md-4 col-lg-3" key={c.id}><CategoryCard c={c} /></div>)}
        </div>
      </main>
      <Footer />
    </>
  )
}
