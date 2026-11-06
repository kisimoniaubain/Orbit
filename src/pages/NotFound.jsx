import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '96px 24px', textAlign: 'center' }}>
        <h1 className="orbit-h1 mb-2">404</h1>
        <p className="orbit-body mb-4">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-orbit btn-orbit-primary">Go Home</a>
      </main>
      <Footer />
    </>
  )
}
