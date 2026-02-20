import React, { useState } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setLoading(true)

    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)

    try {
      const r = await api.post('/auth/token', form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })

      localStorage.setItem('access_token', r.data.access_token)
      navigate('/')
      window.location.reload()
    } catch (err) {
      alert('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5 mt-lg-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
            
            <div className="text-center mb-5">
              <div className="d-inline-block bg-primary bg-opacity-10 text-primary p-3 rounded-circle mb-3">
                <span className="fs-3">🔐</span>
              </div>
              <h2 className="fw-bold text-dark">Welcome Back</h2>
              <p className="text-muted small">Sign in to manage your orders and profile</p>
            </div>

            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-secondary ls-1">
                  Email Address
                </label>
                <input 
                  type="email"
                  className="form-control form-control-lg rounded-pill px-4 border-light-subtle shadow-none text-dark bg-light bg-opacity-50" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-uppercase text-secondary ls-1 m-0">
                    Password
                  </label>

                  {/* Updated Forgot Password Link */}
                  <Link 
                    to="/forgot-password"
                    className="text-decoration-none fw-bold text-primary"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Forgot Password?
                  </Link>
                </div>

                <input 
                  type="password"
                  className="form-control form-control-lg rounded-pill px-4 border-light-subtle shadow-none text-dark bg-light bg-opacity-50" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow transition-all mb-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ) : "Sign In"}
              </button>
            </form>

            <div className="text-center">
              <p className="small text-muted mb-0">
                Don’t have an account?{" "}
                <Link 
                  to="/register" 
                  className="fw-bold text-primary text-decoration-none border-bottom border-primary border-2 pb-1"
                >
                  Create Account
                </Link>
              </p>
            </div>

          </div>

          <div className="text-center mt-4">
            <span className="text-muted small">
              <span className="me-1">🛡️</span> Secure, encrypted login
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
