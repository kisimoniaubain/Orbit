import React from 'react'
import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'

export default function CategoryCard({ c }) {
  const Icon = Icons[c.icon] || Icons.Folder
  return (
    <Link to={`/templates?c=${c.id}`} className="orbit-card d-flex align-items-center gap-3 p-3" style={{ textDecoration: 'none' }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--orbit-primary-soft)', color: 'var(--orbit-primary)', display: 'grid', placeItems: 'center' }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
        <div className="orbit-small">Browse templates</div>
      </div>
    </Link>
  )
}
