import React, { useEffect, useState } from 'react'
import api from '../api'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const perPage = 20

  useEffect(() => {
    fetchProducts()
  }, [page])

  function fetchProducts() {
    api.get(`/products`, { params: { q: query || undefined, page, per_page: perPage } }).then((res) => {
      setProducts(res.data.items)
      setTotal(res.data.total)
    })
  }

  async function addToCart(productId) {
    let cartId = localStorage.getItem('cart_id')
    if (!cartId) {
      const r = await api.post(`/carts`)
      cartId = r.data.id
      localStorage.setItem('cart_id', cartId)
    }
    await api.post(`/carts/${cartId}/items`, { product_id: productId, quantity: 1 })
    alert('Added to cart')
  }

  function onSearch(e) {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage))

  return (
    <div>
      <form className="mb-3 d-flex" onSubmit={onSearch}>
        <input className="form-control me-2" placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-outline-primary">Search</button>
      </form>

      <div className="row">
      {products.map((p) => (
        <div className="col-md-4" key={p.id}>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{p.name}</h5>
              <p className="card-text">{p.description}</p>
              <p className="card-text fw-bold">${p.price.toFixed(2)}</p>
              <button className="btn btn-primary" onClick={() => addToCart(p.id)}>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>Showing page {page} of {totalPages} ({total} products)</div>
        <div>
          <button className="btn btn-sm btn-outline-secondary me-2" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>
    </div>
  )
}
