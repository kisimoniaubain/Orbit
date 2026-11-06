import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, ShoppingCart, Heart } from 'lucide-react'
import { isFavorite, toggleFavorite } from '../lib/favorites'

export function PricingBadge({ type }) {
  return type === 'free'
    ? <span className="badge-orbit badge-free">Free</span>
    : <span className="badge-orbit badge-premium">Premium</span>
}

export function TechBadge({ tech }) {
  return <span className="tech-badge">{tech}</span>
}

export default function TemplateCard({ t, onPreview }) {
  const [fav, setFav] = useState(isFavorite(t.id))
  const handleFav = (e) => {
    e.preventDefault(); e.stopPropagation()
    toggleFavorite(t.id); setFav(isFavorite(t.id))
  }
  return (
    <div className="orbit-card template-card" style={{ borderRadius: 20 }}>
      <div className="preview">
        <img src={t.image} alt={t.name} loading="lazy" />
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <PricingBadge type={t.priceType} />
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: 6 }}>
          {t.technologies.slice(0,2).map(x => <TechBadge key={x} tech={x} />)}
        </div>
      </div>
      <div className="body">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h3 className="title">{t.name}</h3>
          <button className="btn-orbit btn-orbit-ghost" style={{ padding: 4, height: 'auto', color: fav ? 'var(--orbit-danger)' : 'var(--orbit-text-muted)' }} onClick={handleFav} aria-label="Save">
            <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="desc">{t.tagline}</p>
        <div className="meta">
          <span style={{ fontWeight: 700, color: 'var(--orbit-primary)' }}>
            {t.priceType === 'free' ? 'Free' : `$${t.price}`}
          </span>
          <div className="d-flex gap-2">
            <button className="btn-orbit btn-orbit-ghost" style={{ padding: '6px 10px', fontSize: 12, height: 'auto' }} onClick={() => onPreview && onPreview(t)}>
              <Eye size={13} /> Preview
            </button>
            <Link to={`/templates/${t.id}`} className="btn-orbit btn-orbit-primary" style={{ padding: '6px 12px', fontSize: 12, height: 'auto' }}>
              <ShoppingCart size={13} /> {t.priceType === 'free' ? 'Download' : 'Buy'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


