import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '64px 24px', maxWidth: 600 }}>
        <h1 className="orbit-h2 mb-3">Contact</h1>
        <form className="form-orbit">
          <div className="mb-3"><label className="form-label">Name</label><input className="form-control" /></div>
          <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" /></div>
          <div className="mb-3"><label className="form-label">Message</label><textarea className="form-control" rows={4} /></div>
          <button className="btn-orbit btn-orbit-primary">Send</button>
        </form>
      </main>
      <Footer />
    </>
  )
}
