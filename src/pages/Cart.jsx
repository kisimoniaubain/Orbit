import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getCart, removeFromCart, clearCart } from '../lib/cart'
import { api } from '../lib/api'

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(getCart())
  const [loading, setLoading] = useState(false)
  const total = cart.reduce((a, c) => a + (c.price || 0), 0)
  const checkout = async () => {
    setLoading(true)
    try {
      for (const c of cart) {
        await api('/api/purchases', { method: 'POST', body: JSON.stringify({ productId: c.id, productName: c.name, amount: c.price || 0, paymentMethod: 'card' }) })
      }
      clearCart()
      setCart([])
      navigate('/purchases')
    } catch (e) { alert(e.message) }
    setLoading(false)
  }
  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '40px 24px 64px' }}>
        <h1 className="orbit-h2 mb-3">Cart</h1>
        {cart.length === 0 ? (
          <div className="orbit-card" style={{ padding: 24 }}><p className="orbit-body">Your cart is empty. Browse templates to add items.</p><Link to="/templates" className="btn-orbit btn-orbit-primary">Browse Templates</Link></div>
        ) : (
          <>
            <div className="admin-card mb-3">
              {cart.map(c => (
                <div key={c.id} className="d-flex align-items-center gap-3 mb-2 pb-2" style={{ borderBottom: '1px solid var(--orbit-border)' }}>
                  <img src={c.image} alt={c.name} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{c.name}</div><div className="orbit-small">{c.priceType === 'free' ? 'Free' : '$' + c.price}</div></div>
                  <button className="btn-orbit btn-orbit-ghost" style={{ color: 'var(--orbit-danger)', padding: '4px 8px', fontSize: 12 }} onClick={() => { removeFromCart(c.id); setCart(getCart()) }}>Remove</button>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div style={{ fontSize: 20, fontWeight: 800 }}>Total: ${total}</div>
              <button className="btn-orbit btn-orbit-primary" disabled={loading} onClick={checkout}>{loading ? 'Processing...' : 'Checkout'}</button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
