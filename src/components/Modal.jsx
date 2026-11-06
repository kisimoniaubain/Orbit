import React from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(16,24,40,.5)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div className="orbit-card" style={{ maxWidth: 520, width: '100%', padding: 24 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="orbit-h3" style={{ margin: 0 }}>{title}</h3>
          <button className="btn-orbit btn-orbit-ghost" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
