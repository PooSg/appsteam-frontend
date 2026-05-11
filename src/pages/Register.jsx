import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

export default function Register() {
  const [form, setForm]     = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      return setError('Passwords do not match')
    }
    setLoading(true)
    try {
      await registerUser({ username: form.username, email: form.email, password: form.password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-semibold text-primary mb-1">Create account</h1>
        <p className="text-muted text-sm mb-6">Join Appsteam and start playing</p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <label className="label">Username</label>
            <input name="username" type="text" placeholder="coolplayer123"
              value={form.username} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="label">Email address</label>
            <input name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="label">Password</label>
            <input name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="label">Confirm password</label>
            <input name="confirm" type="password" placeholder="••••••••"
              value={form.confirm} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
