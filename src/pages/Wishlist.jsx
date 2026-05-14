import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWishlist, removeFromWishlist } from '../services/api'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getWishlist()
      .then(res => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleRemove(game_id) {
    await removeFromWishlist(game_id)
    setItems(items.filter(i => i.game_id !== game_id))
  }

  if (loading) return <div className="text-center mt-20 text-muted">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">My Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-muted">Your wishlist is empty.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map(item => (
            <div key={item.wishlist_id} className="card flex items-center gap-4">
              <img
                src={item.cover_image || ''}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg bg-border"
                onError={e => e.target.style.display='none'}
              />
              <div className="flex-1">
                <p className="text-primary font-semibold">{item.title}</p>
                <p className="text-muted text-sm">{item.genre}</p>
                <p className="text-accent text-sm">₱{Number(item.price).toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/game/${item.game_id}`)}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  View
                </button>
                <button
                  onClick={() => handleRemove(item.game_id)}
                  className="btn-outline text-xs py-1.5 px-3 text-red-400 border-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}