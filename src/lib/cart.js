const KEY = 'orbit_cart'
export function getCart() { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
export function addToCart(p) {
  const cart = getCart()
  if (!cart.find(x => x.id === (p.id || p._id))) cart.push({ id: p.id || p._id, name: p.name, price: p.price, priceType: p.priceType, image: p.image })
  localStorage.setItem(KEY, JSON.stringify(cart))
  return cart
}
export function removeFromCart(id) {
  const cart = getCart().filter(x => x.id !== id)
  localStorage.setItem(KEY, JSON.stringify(cart))
  return cart
}
export function clearCart() { localStorage.removeItem(KEY) }