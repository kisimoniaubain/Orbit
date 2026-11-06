import React from 'react'

export default function Toast({ message }) {
  if (!message) return null
  return <div className="orbit-toast">{message}</div>
}
