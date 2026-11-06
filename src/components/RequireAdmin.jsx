import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAdmin } from '../lib/auth'

export default function RequireAdmin({ children }) {
  if (!isAdmin()) return <Navigate to="/signin" replace />
  return children
}
