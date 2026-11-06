import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { Card } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Failed to load product', err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading product...</div>

  if (!product) return <div>Product not found</div>

  return (
    <div className="product-detail-page">
      <Card
        title={product.name}
        bordered={false}
        cover={product.image ? { src: product.image } : undefined}
      >
        <Meta
          title={product.tagline}
          description={product.description?.substring(0, 80)}
        >
          <Tag key="price" style={{ background: '#f4f6f9', color: '#111827' }}>
            ${product.price || 0}
          </Tag>
          {product.priceType && (
            <Tag
              key="price-type"
              style={{
                background: product.priceType === 'premium' ? '#e53935' : '#38a169',
                color: '#fff'
              }}
            >
              {product.priceType}
            </Tag>
          )}
        </Meta>
        <div style={{ padding: '24px' }}>
          <p>{product.description || 'No description'}</p>
          <p>Downloads: {product.downloads || 0}</p>
          <p>Version: {product.version || 'N/A'}</p>
          <p>Rating: {product.rating || 0}/5</p>
          <p>License: {product.license || 'N/A'}</p>
        </div>
      </Card>
    </div>
  )
}

export default ProductDetail