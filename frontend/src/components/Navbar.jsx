import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('access_token')
  const cartId = localStorage.getItem('cart_id')

  function logout() {
    localStorage.removeItem('access_token')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
      <div className="container">

        {/* BRAND */}
        <Link className="navbar-brand fw-bold fs-3 d-flex align-items-center" to="/">
          <span className="bg-primary text-white px-2 rounded-3 me-2">E</span>
          <span className="text-dark">Store</span>
        </Link>

        {/* MOBILE CART + TOGGLER */}
        <div className="d-flex align-items-center d-lg-none ms-auto gap-2">

          {/* Mobile Cart */}
          <Link 
            to="/cart" 
            className="position-relative p-2 bg-light rounded-circle shadow-sm text-dark"
          >
            <span className="fs-5">🛒</span>
            {cartId && (
              <span 
                className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"
              ></span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="navbar-toggler border-0 shadow-none" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* COLLAPSE CONTENT */}
        <div className="collapse navbar-collapse" id="navMenu">

          {/* LEFT LINKS */}
          <ul className="navbar-nav me-auto mt-3 mt-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-muted px-lg-3" to="/">
                Shop
              </Link>
            </li>
          </ul>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">

            {/* Desktop Cart */}
            <Link 
              to="/cart" 
              className="d-none d-lg-flex position-relative p-2 bg-light rounded-circle shadow-sm text-dark"
            >
              <span className="fs-5">🛒</span>
              {cartId && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"
                ></span>
              )}
            </Link>

            {/* Divider (Desktop Only) */}
            <div className="vr d-none d-lg-block opacity-25" style={{ height: '28px' }}></div>

            {/* AUTH BUTTONS */}
            {isLoggedIn ? (
              <button 
                className="btn btn-outline-danger rounded-pill px-4 py-2 fw-bold"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link 
                  to="/login" 
                  className="nav-link fw-bold text-dark px-3"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
                >
                  Join Now
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  )
}
