import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    try {
      const r = await api.post('/auth/token', form)
      localStorage.setItem('access_token', r.data.access_token)
      navigate('/')
      window.location.reload()
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary">Login</button>
          <a href="/forgot">Forgot?</a>
        </div>
      </form>
    </div>
  )
}
