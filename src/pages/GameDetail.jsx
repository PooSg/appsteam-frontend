import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGame, addToCart, getOrders, addToWishlist, removeFromWishlist, getWishlist } from '../services/api'

export default function GameDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding]   = useState(false)
  const [added, setAdded]     = useState(false)
  const [owned, setOwned]     = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    getGame(id)
      .then(res => setGame(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
     getWishlist().then(res => {
  setWishlisted(res.data.some(w => String(w.game_id) === String(id)))
}).catch(() => {}) 

    getOrders().then(res => {
      const allItems = res.data.flatMap(o => o.items || [])
      const owns = allItems.some(item => String(item.game_id) === String(id))
      setOwned(owns)
    }).catch(() => {})
  }, [id])

  async function handleAddToCart() {
    setAdding(true)
    try {
      await addToCart({ game_id: game.game_id, quantity: 1 })
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart')
    } finally {
      setAdding(false)
    }
  }
  async function handleWishlist() {
  try {
    if (wishlisted) {
      await removeFromWishlist(id)
      setWishlisted(false)
    } else {
      await addToWishlist(id)
      setWishlisted(true)
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Could not update wishlist')
  }
}
  if (loading) return <div className="text-center mt-20 text-muted">Loading...</div>
  if (!game)   return null

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-muted text-sm hover:text-primary mb-6 block">
        ← Back to store
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left — main info */}
        <div className="md:col-span-2">
          {/* Cover */}
          <div className="w-full h-52 bg-border rounded-xl overflow-hidden flex items-center justify-center mb-5">
            {game.cover_image
              ? <img src={game.cover_image} alt={game.title} className="w-full h-full object-cover" />
              : <span className="text-muted text-sm">No image</span>
            }
          </div>

          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-primary">{game.title}</h1>
            {owned && (
              <span className="bg-green-900/40 border border-green-700 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
                ✓ You own this game
              </span>
            )}
          </div>

          <p className="text-muted text-sm mb-3">
            {game.genre && <span className="text-accent mr-2">{game.genre}</span>}
            {game.stock > 0
              ? <span className="text-green-400">In stock</span>
              : <span className="text-red-400">Out of stock</span>
            }
          </p>

          {/* Tags */}
          {game.genre && (
            <div className="flex gap-2 flex-wrap mb-4">
              <span className="badge">{game.genre}</span>
              <span className="badge">Digital</span>
              <span className="badge">PC</span>
            </div>
          )}

          {/* Description */}
          <p className="text-muted text-sm leading-relaxed">{game.description || 'No description available.'}</p>
        </div>

        {/* Right — sidebar */}
        <div className="flex flex-col gap-4">
          {/* Price card */}
          <div className="card">
            <p className="text-3xl font-bold text-accent mb-1">₱{Number(game.price).toFixed(2)}</p>
            <p className="text-muted text-xs mb-5">One-time purchase · Digital</p>

            {owned ? (
              <div className="w-full bg-green-900/30 border border-green-700 text-green-400 text-sm font-semibold py-2 rounded-lg text-center mb-2">
                ✓ Already in your library
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={adding || game.stock === 0}
                className="btn-primary mb-2"
              >
                {added ? '✓ Added to cart!' : adding ? 'Adding...' : 'Add to cart'}
              </button>
            )}
            <button
                onClick={handleWishlist}
                  className="btn-outline"
                                          >
                  {wishlisted ? '♥ Wishlisted' : '+ Wishlist'}
              </button>
          </div>

          {/* Info card */}
          <div className="card text-sm">
            {[
              ['Genre',    game.genre || '—'],
              ['Platform', 'PC'],
              ['Stock',    game.stock],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-muted">{k}</span>
                <span className="text-primary">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
