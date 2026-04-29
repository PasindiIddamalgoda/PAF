import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@campus.com')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-eyebrow">Campus command center</div>
        <div className="brand big">Smart Campus Operations Hub</div>
        <p>Use one of the demo accounts to explore resources, bookings, tickets, and notifications.</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="primary-btn">Login</button>
        </form>
        {error && <div className="error-box">{error}</div>}
        <div className="demo-box">
          <strong>Demo users</strong>
          <div>Admin: admin@campus.com / Admin@123</div>
          <div>User: user@campus.com / User@123</div>
          <div>Technician: tech@campus.com / Tech@123</div>
        </div>
      </div>
    </div>
  )
}
