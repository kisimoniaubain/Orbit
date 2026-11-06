import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { loadProducts } from '../lib/products'

export default function Verify() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const emailParam = searchParams.get('email') || ''
  const codeParam = searchParams.get('code') || ''
  const [email, setEmail] = useState(emailParam)
  const [code, setCode] = useState(codeParam)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [scrollImages, setScrollImages] = useState([])

  useEffect(() => { loadProducts().then(list => setScrollImages(list.map(t => t.image))) }, [])

  useEffect(() => {
    if (emailParam && codeParam) {
      setStatus('verifying')
      api('/api/auth/verify-login', { method: 'POST', body: JSON.stringify({ email: emailParam, code: codeParam }) })
        .then(data => {
          localStorage.setItem('orbit_token', data.token)
          localStorage.setItem('orbit_user', JSON.stringify(data.user))
          setStatus('success')
          setMessage('Confirmed! You are now signed in.')
          setTimeout(() => navigate('/'), 1500)
        })
        .catch(e => { setStatus('error'); setMessage(e.message || 'Verification failed.') })
    }
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!email || !code) { setMessage('Email and code are required.'); setStatus('error'); return }
    setLoading(true)
    setStatus('verifying')
    try {
      const data = await api('/api/auth/verify-login', { method: 'POST', body: JSON.stringify({ email, code }) })
      localStorage.setItem('orbit_token', data.token)
      localStorage.setItem('orbit_user', JSON.stringify(data.user))
      setStatus('success')
      setMessage('Confirmed! You are now signed in.')
      setTimeout(() => navigate('/'), 1500)
    } catch (e) {
      setStatus('error')
      setMessage(e.message || 'Verification failed.')
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <div className="scroll-bg" aria-hidden="true">
        {scrollImages.concat(scrollImages).map((src, i) => (
          <img key={i} src={src} alt="" />
        ))}
      </div>
      <div className="scroll-overlay" aria-hidden="true" />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, gap: 32, flexWrap: 'wrap' }}>
        <img src="/pair-programming.svg" alt="People collaborating through pair programming" style={{ display: 'inline-block', width: 440, maxWidth: '100%', height: 'auto' }} />
        <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <Link to="/" className="d-inline-block mb-3"><img src="/logo.png" alt="ORBIT" style={{ width: 96, height: 96 }} /></Link>
          <h1 className="orbit-h3" style={{ marginBottom: 8 }}>Confirm sign-in</h1>
          {(email || emailParam) && <p className="orbit-small mb-3">Enter the code sent to {email || emailParam}</p>}
          <div className="orbit-card" style={{ padding: 32, background: 'transparent', border: 'none', textAlign: 'left', boxShadow: 'none' }}>
            {status === 'verifying' && <p className="orbit-body">Verifying...</p>}
            {status === 'success' && (
              <div className="text-center">
                <p className="orbit-body mb-4">{message}</p>
              </div>
            )}
            {(status === 'idle' || status === 'error') && (
              <form className="form-orbit" onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} style={{ background: 'transparent' }} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Verification code</label>
                  <input className="form-control" value={code} onChange={e => setCode(e.target.value)} style={{ background: 'transparent', letterSpacing: 4, textAlign: 'center', fontSize: 20 }} />
                </div>
                {status === 'error' && message && <div className="orbit-small mb-2" style={{ color: 'var(--orbit-danger)' }}>{message}</div>}
                <button className="btn-orbit btn-orbit-primary w-100" disabled={loading}>{loading ? 'Verifying...' : 'Confirm'}</button>
              </form>
            )}
          </div>
          <div className="orbit-small mt-3" style={{ color: 'var(--orbit-text-muted)' }}>© 2026 ORBIT. All rights reserved.</div>
        </div>
      </div>
    </div>
  )
}
