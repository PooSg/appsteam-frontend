import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGames, deleteGame } from '../../services/api'
import api from '../../services/api'

export default function AdminDashboard() {
  const [games, setGames]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [totalOrders, setTotalOrders]   = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    fetchGames()
    fetchOrderStats()
  }, [])

  async function fetchGames() {
    try {
      const res = await getGames()
      setGames(res.data)
    } finally {
      setLoading(false)
    }
  }

  async function fetchOrderStats() {
    try {
      const res = await api.get('/admin/orders')
      const orders = res.data
      setTotalOrders(orders.length)
      const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
      setTotalRevenue(revenue)
    } catch {}
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await deleteGame(id)
      setGames(games.filter(g => g.game_id !== id))
    } catch { alert('Could not delete game') }
  }

  const filtered = games.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-primary">Admin dashboard</h1>
          <p className="text-muted text-sm">{games.length} games in catalog</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/orders" className="bg-[#1a2235] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#243050] transition-colors border border-gray-600">
            Orders
          </Link>
          <Link to="/admin/add" className="bg-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
            + Add game
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          ['Total games',   games.length],
          ['In stock',      games.filter(g => g.stock > 0).length],
          ['Out of stock',  games.filter(g => g.stock === 0).length],
        ].map(([label, val]) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted text-xs mb-1">{label}</p>
            <p className="text-primary text-2xl font-semibold">{val}</p>
          </div>
        ))}
      </div>

      {/* Sales stats row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card border border-cyan-800 rounded-xl p-4">
          <p className="text-muted text-xs mb-1">Total Orders</p>
          <p className="text-cyan-400 text-2xl font-semibold">{totalOrders}</p>
        </div>
        <div className="bg-card border border-green-800 rounded-xl p-4">
          <p className="text-muted text-xs mb-1">Total Revenue</p>
          <p className="text-green-400 text-2xl font-semibold">₱{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />

      {/* Table */}
      {loading ? (
        <div className="text-center text-muted py-20">Loading...</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Title', 'Genre', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-muted font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-10 px-4">No games found.</td></tr>
              ) : filtered.map(game => (
                <tr key={game.game_id} className="border-b border-border/50 hover:bg-border/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-border rounded flex-shrink-0 overflow-hidden">
                        {game.cover_image && <img src={game.cover_image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-primary font-medium truncate max-w-[180px]">{game.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{game.genre || '—'}</td>
                  <td className="px-4 py-3 text-accent font-semibold">₱{Number(game.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${game.stock === 0 ? 'bg-red-900/30 text-red-400 border-red-800' : ''}`}>
                      {game.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link to={`/admin/edit/${game.game_id}`}
                        className="text-accent hover:underline text-xs">Edit</Link>
                      <button onClick={() => handleDelete(game.game_id, game.title)}
                        className="text-red-400 hover:underline text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}