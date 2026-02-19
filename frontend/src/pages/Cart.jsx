import React, { useEffect, useState } from 'react'
import api from '../api'

export default function CartPage() {
  const [cart, setCart] = useState(null)

  useEffect(() => {
    const cartId = localStorage.getItem('cart_id')
    if (cartId) {
      api.get(`/carts/${cartId}`).then((r) => setCart(r.data)).catch(() => setCart(null))
    }
  }, [])

  if (!cart) return <p>Your cart is empty.</p>

  return (
    <div>
      <h2>Cart #{cart.id}</h2>
      <ul className="list-group">
        {cart.items.map((it) => (
          <li className="list-group-item" key={it.id}>
            {it.product.name} — {it.quantity} × ${it.product.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <button className="btn btn-primary" onClick={async () => {
          await api.post(`/carts/${cart.id}/checkout`)
          alert('Checked out (demo)')
        }}>Checkout</button>
      </div>
    </div>
  )
}
