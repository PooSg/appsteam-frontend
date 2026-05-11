import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.user, res.data.token)
      navigate(res.data.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-semibold text-primary mb-1">Welcome back</h1>
        <p className="text-muted text-sm mb-6">Sign in to your Appsteam account</p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
