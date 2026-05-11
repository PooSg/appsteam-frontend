import { Link } from 'react-router-dom'

export default function GameCard({ game }) {
  return (
    <Link to={`/game/${game.game_id}`} className="card hover:border-accent transition-colors group cursor-pointer block">
      {/* Thumbnail */}
      <div className="w-full h-36 bg-border rounded-lg mb-3 overflow-hidden flex items-center justify-center">
        {game.cover_image ? (
          <img
            src={game.cover_image}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-muted text-xs">No image</span>
        )}
      </div>

      {/* Info */}
      <p className="text-primary font-semibold text-sm truncate">{game.title}</p>
      <p className="text-muted text-xs mt-0.5 mb-2">{game.genre || 'Game'}</p>
      <p className="text-accent font-bold text-sm">₱{Number(game.price).toFixed(2)}</p>
    </Link>
  )
}
