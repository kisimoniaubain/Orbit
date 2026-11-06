import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const cols = [
    { title: 'Explore', links: [{l:'All Templates',t:'/templates'},{l:'Free Templates',t:'/free'},{l:'Premium Templates',t:'/premium'}] },
    { title: 'Categories', links: [{l:'Business',t:'/templates?c=business'},{l:'Portfolio',t:'/templates?c=portfolio'},{l:'SaaS',t:'/templates?c=saas'},{l:'E-commerce',t:'/templates?c=ecommerce'}] },
    { title: 'Resources', links: [{l:'Documentation',t:'/help'},{l:'Licensing',t:'/licensing'},{l:'Help Center',t:'/help'}] },
    { title: 'Company', links: [{l:'About',t:'/about'},{l:'Contact',t:'/contact'}] },
  ]
  return (
    <footer className="orbit-footer">
      <div className="container-orbit">
        <div className="row g-4">
          <div className="col-lg-4">
            <Link to="/" className="orbit-logo mb-2"><img src="/logo.png" alt="ORBIT logo" style={{ width: 64, height: 64, borderRadius: 9, objectFit: 'cover' }} /></Link>
            <p className="orbit-small">A central destination to discover the building blocks for your next website.</p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" aria-label="GitHub"><Github size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="#" aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>
          {cols.map(c => (
            <div className="col-6 col-lg-2" key={c.title}>
              <h6 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{c.title}</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                {c.links.map(x => <li key={x.l}><Link to={x.t}>{x.l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-top orbit-small">© 2026 ORBIT. All rights reserved.</div>
      </div>
    </footer>
  )
}




