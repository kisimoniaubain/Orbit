import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Help() {
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '64px 24px' }}>
        <h1 className="orbit-h2 mb-3">Help Center</h1>
        <p className="orbit-body">Find answers to common questions about templates, licensing, and downloads.</p>
      </main>
      <Footer />
    </>
  )
}
