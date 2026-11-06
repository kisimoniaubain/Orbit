import React from 'react'
import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <div className="orbit-breadcrumb mb-3">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span className="sep">/</span>}
        </span>
      ))}
    </div>
  )
}
