import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createGame } from '../../services/api'
import GenrePicker from '../../components/GenrePicker'

export default function AddGame() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', price: '', genre: '', stock: '', cover_image: ''
  })
  const [error, setError]   = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await createGame(form)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add game')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-primary">Add new game</h1>
        <Link to="/admin" className="text-muted text-sm hover:text-primary">← Back</Link>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-3 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
        <div className="input-group">
          <label className="label">Game title *</label>
          <input name="title" type="text" placeholder="e.g. Hollow Knight"
            value={form.title} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="input-group">
            <label className="label">Price (₱) *</label>
            <input name="price" type="number" min="0" step="0.01" placeholder="299.00"
              value={form.price} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="label">Stock *</label>
            <input name="stock" type="number" min="0" placeholder="50"
              value={form.stock} onChange={handleChange} required />
          </div>
        </div>

        <div className="input-group">
          <label className="label">Genres</label>
          <GenrePicker
            value={form.genre}
            onChange={(val) => setForm({ ...form, genre: val })}
          />
        </div>

        <div className="input-group">
          <label className="label">Cover image URL</label>
          <input name="cover_image" type="url" placeholder="https://..."
            value={form.cover_image} onChange={handleChange} />
        </div>

        {form.cover_image && (
          <img src={form.cover_image} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-border" />
        )}

        <div className="input-group">
          <label className="label">Description</label>
          <textarea name="description" rows={4} placeholder="Write a short description..."
            value={form.description} onChange={handleChange}
            className="bg-dark border border-border rounded-lg px-3 py-2 text-primary text-sm outline-none focus:border-accent resize-none"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Adding...' : 'Add game'}
          </button>
          <button type="button" onClick={() => navigate('/admin')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
