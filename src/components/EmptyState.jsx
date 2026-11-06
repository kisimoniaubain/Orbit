import React from 'react'
import { SearchX } from 'lucide-react'

export default function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <SearchX size={40} style={{ opacity: .5, marginBottom: 12 }} />
      <h3>{title || 'No results found'}</h3>
      <p>{text || 'Try adjusting your filters or search terms.'}</p>
    </div>
  )
}
