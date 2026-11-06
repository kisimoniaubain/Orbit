import React from 'react'
import { categories, technologies } from '../data/templates'

export default function FilterSidebar({ filters, setFilters, onClear }) {
  const toggleTech = (t) => {
    setFilters(f => ({
      ...f,
      tech: f.tech.includes(t) ? f.tech.filter(x => x !== t) : [...f.tech, t],
    }))
  }
  const setPrice = (p) => setFilters(f => ({ ...f, price: p }))
  const setCat = (c) => setFilters(f => ({ ...f, category: c }))
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <h6>Category</h6>
        <div className="filter-option" onClick={() => setCat('all')}>
          <input type="radio" checked={filters.category === 'all'} onChange={() => {}} /> All
        </div>
        {categories.map(c => (
          <div className="filter-option" key={c.id} onClick={() => setCat(c.id)}>
            <input type="radio" checked={filters.category === c.id} onChange={() => {}} /> {c.name}
          </div>
        ))}
      </div>
      <div className="filter-group">
        <h6>Technology</h6>
        {technologies.map(t => (
          <label className="filter-option" key={t}>
            <input type="checkbox" checked={filters.tech.includes(t)} onChange={() => toggleTech(t)} /> {t}
          </label>
        ))}
      </div>
      <div className="filter-group">
        <h6>Pricing</h6>
        {['all', 'free', 'premium'].map(p => (
          <div className="filter-option" key={p} onClick={() => setPrice(p)}>
            <input type="radio" checked={filters.price === p} onChange={() => {}} /> {p.charAt(0).toUpperCase() + p.slice(1)}
          </div>
        ))}
      </div>
      <button className="btn-orbit btn-orbit-secondary w-100" onClick={onClear}>Clear all filters</button>
    </div>
  )
}
