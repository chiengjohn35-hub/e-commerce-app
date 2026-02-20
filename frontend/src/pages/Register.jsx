import React, { useState } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Added trailing slash to match FastAPI @router.post("/register/")
      await api.post('/auth/register/', { email, password })
      alert('Account created successfully! Please sign in.')
      navigate('/login')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Registration failed. Try a different email.'
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="bg-primary text-white d-inline-block px-3 py-2 rounded-circle mb-3">
                <span className="fs-4">✨</span>
              </div>
              <h2 className="fw-bold">Create Account</h2>
              <p className="text-muted small">Join our community today</p>
            </div>

            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase">Email Address</label>
                <input 
                  type="email"
                  className="form-control rounded-pill px-3 shadow-none" 
                  placeholder="your@email.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase">Choose Password</label>
                <input 
                  type="password" 
                  className="form-control rounded-pill px-3 shadow-none" 
                  placeholder="Min. 8 characters"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  minLength="8"
                />
              </div>

              <button 
                className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm mb-3 fw-bold" 
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : 'Register Now'}
              </button>

              <div className="text-center">
                <span className="small text-muted">Already have an account? </span>
                <Link to="/login" className="small fw-bold text-decoration-none text-primary">Sign In</Link>
              </div>
            </form>
          </div>
          
          <div className="text-center mt-4">
            <p className="small text-muted px-4">
              By registering, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
