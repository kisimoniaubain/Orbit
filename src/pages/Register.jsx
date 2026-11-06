import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadProducts } from '../lib/products'
import { register } from '../lib/auth'
import { Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [registrationNotice, setRegistrationNotice] = useState('')
  const [scrollImages, setScrollImages] = useState([])
  const googleDiv = useRef(null)
  const handleGoogle = async (accessToken) => {
    try {
      const ui = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${accessToken}` } })
      const payload = await ui.json()
      const data = await (await fetch('http://localhost:5000/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: payload.name, email: payload.email, picture: payload.picture }) })).json()
      if (data.requiresVerification) {
        navigate('/verify?email=' + encodeURIComponent(data.email || payload.email))
      } else {
        localStorage.setItem('orbit_token', data.token)
        localStorage.setItem('orbit_user', JSON.stringify(data.user))
        navigate('/')
      }
    } catch (e) { console.error('GOOGLE ERR', e); setErrors({ email: 'Google sign-in failed' }) }
  }
  const googleLogin = () => {
    if (!window.google) { alert('Google library not loaded'); return }
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) { alert('Missing VITE_GOOGLE_CLIENT_ID'); return }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (resp) => { if (resp.access_token) handleGoogle(resp.access_token) },
    })
    client.requestAccessToken()
  }
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId || !window.google) return
    window.google.accounts.id.initialize({ client_id: clientId, callback: handleGoogle })
    if (googleDiv.current) window.google.accounts.id.renderButton(googleDiv.current, { theme: 'outline', size: 'large', width: 320 })
  }, [])

  useEffect(() => { loadProducts().then(list => setScrollImages(list.map(t => t.image))) }, [])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    if (!form.terms) errs.terms = 'You must accept the terms'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    register(form.name, form.email, form.password)
      .then(user => {
        setLoading(false)
        if (user.emailSent === false) {
          setRegistrationNotice(user.emailWarning || 'Your account was created, but the welcome email could not be delivered.')
          return
        }
        navigate('/')
      })
      .catch(e => {
        console.error('REG ERROR', e)
        setLoading(false)
        setErrors({ email: e.message || 'Registration failed' })
      })
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
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src="/pair-programming.svg" alt="People collaborating through pair programming" style={{ width: 500, maxWidth: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <Link to="/" className="d-inline-block mb-3"><img src="/logo.png" alt="ORBIT" style={{ width: 96, height: 96 }} /></Link>
          <h1 className="orbit-h3" style={{ marginBottom: 24 }}>Create account</h1>
          <div className="orbit-card" style={{ padding: 32, background: 'transparent', border: 'none', textAlign: 'left', boxShadow: 'none' }}>
            <form className="form-orbit" onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" style={{ background: 'transparent' }} value={form.name} onChange={e => set('name', e.target.value)} />
                {errors.name && <div className="orbit-small" style={{ color: 'var(--orbit-danger)' }}>{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" style={{ background: 'transparent' }} value={form.email} onChange={e => set('email', e.target.value)} />
                {errors.email && <div className="orbit-small" style={{ color: 'var(--orbit-danger)' }}>{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="position-relative">
                  <input type={show ? 'text' : 'password'} className="form-control" value={form.password} onChange={e => set('password', e.target.value)} style={{ paddingRight: 40, background: 'transparent' }} />
                  <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 10, top: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--orbit-text)' }}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                {errors.password && <div className="orbit-small" style={{ color: 'var(--orbit-danger)' }}>{errors.password}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" style={{ background: 'transparent' }} value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                {errors.confirm && <div className="orbit-small" style={{ color: 'var(--orbit-danger)' }}>{errors.confirm}</div>}
              </div>
              <div className="mb-3">
                <label className="filter-option">
                  <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)} /> I accept the terms
                </label>
                {errors.terms && <div className="orbit-small" style={{ color: 'var(--orbit-danger)' }}>{errors.terms}</div>}
              </div>
              <button className="btn-orbit btn-orbit-primary w-100" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
              {registrationNotice && <div role="status" className="orbit-small mt-3" style={{ color: 'var(--orbit-warning)' }}>{registrationNotice}</div>}
            </form>
            <div className="text-center mt-3">
              <button className="btn-orbit w-100" type="button" style={{ background: '#000', color: '#fff', border: '1px solid #333', height: 'auto', padding: '10px 16px' }} onClick={googleLogin}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width: 18, height: 18, marginRight: 8 }} />
                Sign up with Google
              </button>
              <div ref={googleDiv} style={{ display: 'none' }}></div>
              {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                <p className="orbit-small mt-2">Google sign-in requires VITE_GOOGLE_CLIENT_ID in .env</p>
              )}
            </div>
            <div className="text-center mt-3 orbit-small">
              Have account? <Link to="/signin" style={{ color: 'var(--orbit-primary)', fontWeight: 600 }}>Sign in</Link>
            </div>
          </div>
          <div className="orbit-small mt-3" style={{ color: 'var(--orbit-text-muted)' }}>© 2026 ORBIT. All rights reserved.</div>
        </div>
      </div>
    </div>
  )
}


