import React, { useState } from 'react'
import { useElements } from '@stripe/react-stripe-js'
import { useNavigate } from 'react-router-dom'
import { Button, Alert } from 'react-bootstrap'

const StripeCheckout = ({ product, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { clientSecret } = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, amount: product.price })
      }).then(res => res.json())

      if (!clientSecret) throw new Error('No client secret')

      const { error, paymentIntent } = await stripe.redirectToCheckout({
        clientSecret,
        successUrl: `${window.location.origin}/purchase-success`,
        cancelUrl: `${window.location.origin}`
      })

      if (error) {
        Alert.danger({ message: error.message })
      } else {
        onSuccess(paymentIntent)
      }
    } catch (err) {
      Alert.danger({ message: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Processing payment...</div>

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', padding: '24px' }}>
      <h3 style={{ marginBottom: '16px', color: '#111827' }}>Complete Purchase</h3>
      <p style={{ marginBottom: '24px', color: '#6b7280' }}>
        {product.name} - ${product.price}
      </p>
      <button type="submit" disabled={loading} style={{
        backgroundColor: '#00ACC1',
        color: '#fff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        width: '100%',
        fontWeight: '600'
      }}>
        {loading ? 'Processing...' : 'Pay with Card'}
      </button>
    </form>
  )
}

export default StripeCheckout