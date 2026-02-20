import React, { useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function requestReset(e) {
    e.preventDefault()
    setLoading(true)
    try {
      // Endpoint updated to match FastAPI trailing slash standards
      const r = await api.post('/auth/forgot-password/', { email })
      if (r.data.token) {
        setToken(r.data.token)
        alert('Demo mode: Token generated automatically.')
      } else {
        alert('If the account exists, instructions have been sent.')
      }
    } catch (err) {
      alert('Could not process request.')
    } finally {
      setLoading(false)
    }
  }

  async function doReset(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/reset-password/', { 
        token, 
        new_password: newPassword 
      })
      alert('Password updated! You can now log in.')
      window.location.href = '/login'
    } catch (err) {
      alert('Reset failed. The token may be expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5 mt-lg-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white text-center">
            
            <div className="mb-4">
              <div className="d-inline-block bg-warning bg-opacity-10 text-warning p-3 rounded-circle mb-3">
                <span className="fs-3">🔑</span>
              </div>
              <h2 className="fw-bold text-dark">Password Recovery</h2>
              <p className="text-muted small">
                {!token ? "Enter your email to receive a reset token" : "Create a secure new password"}
              </p>
            </div>

            {!token ? (
              /* STEP 1: Request Token */
              <form onSubmit={requestReset}>
                <div className="mb-4 text-start">
                  <label className="form-label small fw-bold text-uppercase text-secondary ls-1">Email Address</label>
                  <input 
                    type="email"
                    className="form-control form-control-lg rounded-pill px-4 border-light-subtle shadow-none bg-light bg-opacity-50" 
                    placeholder="your@email.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <button 
                  className="btn btn-dark btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm transition-all"
                  disabled={loading}
                >
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : "Send Reset Token"}
                </button>
              </form>
            ) : (
              /* STEP 2: Reset Password */
              <form onSubmit={doReset} className="text-start animate__animated animate__fadeIn">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-secondary ls-1">Security Token</label>
                  <input 
                    className="form-control form-control-lg rounded-pill px-4 border-light-subtle shadow-none bg-light" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-uppercase text-secondary ls-1">New Password</label>
                  <input 
                    type="password"
                    className="form-control form-control-lg rounded-pill px-4 border-light-subtle shadow-none bg-light bg-opacity-50" 
                    placeholder="••••••••"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button 
                  className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : "Update Password"}
                </button>
              </form>
            )}

            <div className="mt-4 pt-3">
              <Link to="/login" className="small text-decoration-none fw-bold text-primary">
                ← Back to Login
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
