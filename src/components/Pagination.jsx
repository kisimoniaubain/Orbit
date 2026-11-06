import React from 'react'

export default function Pagination({ page, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1)
  return (
    <nav className="d-flex justify-content-center gap-2 mt-4">
      {pages.map(p => (
        <button key={p} className={p === page ? 'btn-orbit btn-orbit-primary' : 'btn-orbit btn-orbit-secondary'} style={{ padding: '6px 12px' }} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
    </nav>
  )
}
