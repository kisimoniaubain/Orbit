import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { login } from '../lib/auth'
import { api } from '../lib/api'
import { loadProducts } from '../lib/products'
import { Eye, EyeOff } from 'lucide-react'

export default function SignIn() {
  const navigate = useNavigate()
  const [step, setStep] = useState('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [scrollImages, setScrollImages] = useState([])
  const [searchParams] = useSearchParams()
  useEffect(() => {
    loadProducts().then(products => setScrollImages(products.map(product => product.image)))
  }, [])

  useEffect(() => {
    const v = searchParams.get('verify')
    const em = searchParams.get('email')
    const cd = searchParams.get('code')
    if (v && em && cd) {
      setPendingEmail(em)
      setCode(cd)
      setStep('code')
      // auto verify
      api('/api/auth/verify-login', { method: 'POST', body: JSON.stringify({ email: em, code: cd }) })
        .then(data => { localStorage.setItem('orbit_token', data.token); localStorage.setItem('orbit_user', JSON.stringify(data.user)); navigate('/') })
        .catch(e => setErrors({ code: e.message || 'Invalid code' }))
    }
  }, [])

  const submitCredentials = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!email) errs.email = 'Email is required'
    if (!password) errs.password = 'Password is required'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      const data = await login(email, password)
      if (data?.requiresVerification) {
        navigate('/verify?email=' + encodeURIComponent(data.email || email))
        return
      } else if (data) {
        navigate('/')
      }
    } catch (e) {
      console.error('LOGIN ERROR', e)
      setLoading(false)
      const msg = e.message || 'Login failed'
      if (msg.toLowerCase().includes('password')) setErrors({ password: msg })
      else setErrors({ email: msg })
    }
  }

  const submitCode = async (e) => {
    e.preventDefault()
    if (!code) { setErrors({ code: 'Code is required' }); return }
    setLoading(true)
    try {
      const data = await api('/api/auth/verify-login', { method: 'POST', body: JSON.stringify({ email: pendingEmail, code }) })
      localStorage.setItem('orbit_token', data.token)
      localStorage.setItem('orbit_user', JSON.stringify(data.user))
      navigate('/')
    } catch (e) {
      console.error('VERIFY ERROR', e)
      setLoading(false)
      setErrors({ code: e.message || 'Invalid code' })
    }
  }

  const googleLogin = () => {
    if (!window.google) { alert('Google library not loaded'); return }
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) { alert('Missing VITE_GOOGLE_CLIENT_ID'); return }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (resp) => {
        if (resp.access_token) {
          fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${resp.access_token}` } })
            .then(r => r.json())
            .then(payload => fetch('http://localhost:5000/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: payload.name, email: payload.email, picture: payload.picture }) }))
            .then(r => r.json())
            .then(data => {
              if (data.requiresVerification) {
                navigate('/verify?email=' + encodeURIComponent(data.email || payload.email))
              } else {
                localStorage.setItem('orbit_token', data.token)
                localStorage.setItem('orbit_user', JSON.stringify(data.user))
                navigate('/')
              }
            })
            .catch(e => { console.error('GOOGLE ERR', e); setErrors({ email: 'Google sign-in failed' }) })
        }
      },
    })
    client.requestAccessToken()
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
          <h1 className="orbit-h3" style={{ marginBottom: 24 }}>Sign in</h1>
          <div className="orbit-card" style={{ padding: 32, background: 'transparent', border: 'none', textAlign: 'left', boxShadow: 'none' }}>
            {step === 'credentials' ? (
              <form className="form-orbit" onSubmit={submitCredentials}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} style={{ background: 'transparent' }} />
                  {errors.email && <div className="orbit-small" style={{ color: 'var(--orbit-danger)' }}>{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="position-relative">
                    <input type={show ? 'text' : 'password'} className="form-control" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 40, background: 'transparent' }} />
                    <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 10, top: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--orbit-text)' }}>
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <div className="orbit-small" style={{ color: 'var(--orbit-danger)' }}>{errors.password}</div>}
                </div>
                <button className="btn-orbit btn-orbit-primary w-100" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
              </form>
            ) : (
              <form className="form-orbit" onSubmit={submitCode}>
                <p className="orbit-small mb-3">We sent a 6-digit code to {pendingEmail}. Enter it below.</p>
                <div className="mb-3">
                  <label className="form-label">Verification code</label>
                  <input className="form-control" value={code} onChange={e => setCode(e.target.value)} style={{ background: 'transparent', letterSpacing: 4, textAlign: 'center', fontSize: 20 }} />
                  {errors.code && <div className="orbit-small" style={{ color: 'var(--orbit-danger)' }}>{errors.code}</div>}
                </div>
                <button className="btn-orbit btn-orbit-primary w-100" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
                <button type="button" className="btn-orbit btn-orbit-ghost w-100 mt-2" onClick={() => setStep('credentials')}>Back</button>
              </form>
            )}
            <div className="text-center mt-3">
              <button className="btn-orbit w-100" type="button" style={{ background: '#000', color: '#fff', border: '1px solid #333', height: 'auto', padding: '10px 16px' }} onClick={googleLogin}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" style={{ width: 18, height: 18, marginRight: 8 }} />
                Sign in with Google
              </button>
            </div>
            <div className="text-center mt-3 orbit-small">
              No account? <Link to="/register" style={{ color: 'var(--orbit-primary)', fontWeight: 600 }}>Create one</Link>
            </div>
          </div>
          <div className="orbit-small mt-3" style={{ color: 'var(--orbit-text-muted)' }}>© 2026 ORBIT. All rights reserved.</div>
        </div>
      </div>
    </div>
  )
}
