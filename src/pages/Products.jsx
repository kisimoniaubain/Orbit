import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { Card } from 'antd'
import { Search, Star } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : [data || {}]))
      .catch(err => console.error('Failed to load products', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="products-page">
      <h1>Products</h1>
      {loading && <p>Loading products...</p>}
      <div className="product-grid">
        {products.map((product, index) => (
          <Card key={product._id || product.id} title={product.name} bordered={false}>
            <img
              alt={product.name}
              src={product.image || '/placeholder-product.jpg'}
              style={{ width: '100%', height: 200, objectFit: 'cover' }}
            />
            <div style={{ padding: '12px' }}>
              <h4>{product.name}</h4>
              <p>{product.description || 'No description'}</p>
              <p>Price: ${product.price || 0}</p>
              <p>Downloads: {product.downloads || 0}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Products