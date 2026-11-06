import React from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="position-relative">
      <Search size={18} style={{ position: 'absolute', left: 14, top: 12, color: 'var(--orbit-text-muted)' }} />
      <input
        className="form-control"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Search templates, categories, or technologies...'}
        style={{ paddingLeft: 42, paddingRight: 36, borderRadius: 'var(--orbit-radius)', height: 44 }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{ position: 'absolute', right: 10, top: 10, border: 'none', background: 'transparent', cursor: 'pointer' }} aria-label="Clear">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
