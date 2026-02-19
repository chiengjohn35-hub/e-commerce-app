import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const logged = !!localStorage.getItem('access_token')
  const cartId = localStorage.getItem('cart_id')

  function logout() {
    localStorage.removeItem('access_token')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">E‑Commerce</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart {cartId ? '(saved)' : ''}</Link>
            </li>
            {logged ? (
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-secondary" onClick={logout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
