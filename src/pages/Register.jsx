import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, getGames } from '../services/api'

export default function Register() {
  const [form, setForm]       = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [covers, setCovers]   = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getGames().then(res => {
      const imgs = res.data.filter(g => g.cover_image).map(g => g.cover_image)
      const repeated = []
      while (repeated.length < 30) repeated.push(...imgs)
      setCovers(repeated.slice(0, 30))
    }).catch(() => {})
  }, [])

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
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden"
         style={{ marginTop: '-24px' }}>

      {/* Background grid */}
      <div className="absolute inset-0 grid grid-cols-5 sm:grid-cols-6 gap-1 opacity-40 scale-110 blur-sm">
        {covers.map((src, i) => (
          <div key={i} className="aspect-[3/4] overflow-hidden rounded">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Register card */}
      <div className="relative z-10 card w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-accent tracking-widest mb-1">APPSTEAM</h1>
          <p className="text-primary text-lg font-semibold">Create account</p>
          <p className="text-muted text-sm">Join Appsteam and start playing</p>
        </div>

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