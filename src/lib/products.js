import { api } from './api'

export async function loadProducts() {
  try {
    const data = await api('/api/products')
    if (Array.isArray(data) && data.length > 0) {
      return data.map(p => ({ ...p, id: p.id || p._id }))
    }
  } catch (e) {}
  const { templates } = await import('../data/templates')
  return [...templates]
}



export async function addProduct(p) {
  return api('/api/products', { method: 'POST', body: JSON.stringify(p) })
}

export async function updateProduct(id, patch) {
  return api('/api/products/' + id, { method: 'PUT', body: JSON.stringify(patch) })
}

export async function deleteProduct(id) {
  return api('/api/products/' + id, { method: 'DELETE' })
}
