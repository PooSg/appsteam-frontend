import { useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, login, token } = useAuth()
  const [form, setForm]       = useState({ username: '', email: '' })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [msg, setMsg]         = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    getProfile()
      .then(res => {
        setForm({ username: res.data.username, email: res.data.email })
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSaveInfo(e) {
    e.preventDefault()
    setMsg(''); setError('')
    setSaving(true)
    try {
      const res = await updateProfile({ username: form.username, email: form.email })
      login(res.data.user, token)
      setMsg('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setMsg(''); setError('')
    if (passwords.newPass !== passwords.confirm) return setError('Passwords do not match')
    setSaving(true)
    try {
      await updateProfile({ current_password: passwords.current, new_password: passwords.newPass })
      setPasswords({ current: '', newPass: '', confirm: '' })
      setMsg('Password changed successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not change password')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center mt-20 text-muted">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-primary mb-6">My profile</h1>

      {msg   && <div className="bg-green-900/30 border border-green-700 text-green-300 text-sm px-3 py-2 rounded-lg mb-4">{msg}</div>}
      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>}

      {/* Avatar */}
      <div className="card flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-border flex items-center justify-center text-xl text-accent font-bold flex-shrink-0">
          {form.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-primary font-semibold">{form.username}</p>
          <p className="text-muted text-sm">{form.email}</p>
          <span className="badge mt-1 inline-block">{user?.role}</span>
        </div>
      </div>

      {/* Edit info */}
      <div className="card mb-5">
        <h2 className="text-primary font-semibold text-sm mb-4">Account information</h2>
        <form onSubmit={handleSaveInfo} className="flex flex-col gap-4">
          <div className="input-group">
            <label className="label">Username</label>
            <input name="username" type="text" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="input-group">
            <label className="label">Email address</label>
            <input name="email" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card">
        <h2 className="text-primary font-semibold text-sm mb-4">Change password</h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div className="input-group">
            <label className="label">Current password</label>
            <input type="password" placeholder="••••••••"
              value={passwords.current}
              onChange={e => setPasswords({ ...passwords, current: e.target.value })} required />
          </div>
          <div className="input-group">
            <label className="label">New password</label>
            <input type="password" placeholder="••••••••"
              value={passwords.newPass}
              onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} required />
          </div>
          <div className="input-group">
            <label className="label">Confirm new password</label>
            <input type="password" placeholder="••••••••"
              value={passwords.confirm}
              onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Updating...' : 'Change password'}
          </button>
        </form>
      </div>
    </div>
  )
}
