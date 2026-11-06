import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Licensing() {
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '64px 24px' }}>
        <h1 className="orbit-h2 mb-3">Licensing and Usage</h1>
        <p className="orbit-body">Templates are provided under their stated licenses. Free templates may use MIT-style terms; premium templates require purchase.</p>
      </main>
      <Footer />
    </>
  )
}
