import React, { useState } from 'react'
import api from '../api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')

  async function requestReset(e) {
    e.preventDefault()
    try {
      const r = await api.post('/auth/forgot-password', { email })
      if (r.data.token) setToken(r.data.token)
      alert('If email exists, reset token created (demo).')
    } catch (err) {
      alert('Error')
    }
  }

  async function doReset(e) {
    e.preventDefault()
    try {
      await api.post('/auth/reset-password', { token, new_password: newPassword })
      alert('Password reset; please login')
    } catch (err) {
      alert('Reset failed')
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Forgot Password</h2>
      <form onSubmit={requestReset}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn btn-secondary">Request Reset</button>
      </form>

      {token && (
        <form onSubmit={doReset} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Token</label>
            <input className="form-control" value={token} onChange={(e) => setToken(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">New password</label>
            <input className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary">Reset Password</button>
        </form>
      )}
    </div>
  )
}
