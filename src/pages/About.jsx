import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '64px 24px' }}>
        <h1 className="orbit-h2 mb-3">About ORBIT</h1>
        <p className="orbit-body">ORBIT is a template marketplace helping people discover and build better websites. Demonstration content.</p>
      </main>
      <Footer />
    </>
  )
}
