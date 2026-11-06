import React from 'react'

export default function SortDropdown({ value, onChange }) {
  const opts = ['Recommended', 'Newest', 'Most Popular', 'Price Low to High', 'Price High to Low']
  return (
    <select className="form-select" value={value} onChange={e => onChange(e.target.value)} style={{ width: 'auto', borderRadius: 'var(--orbit-radius-sm)' }}>
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  )
}
