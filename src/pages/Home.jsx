import { useState, useEffect } from 'react'
import { getGames } from '../services/api'
import GameCard from '../components/GameCard'

const GENRES = ['All', 'Action', 'Action RPG', 'Adventure', 'Battle Royale', 'Fighting', 'FPS', 'Horror', 'Indie', 'MMO', 'Open World', 'Platformer', 'Puzzle', 'Racing', 'RPG', 'Roguelike', 'Sandbox', 'Shooter', 'Simulation', 'Sports', 'Strategy', 'Survival', 'Visual Novel']

export default function Home() {
  const [games, setGames]     = useState([])
  const [genre, setGenre]     = useState('All')
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [genre])

  async function fetchGames() {
    setLoading(true)
    try {
      const params = {}
      if (genre !== 'All') params.genre = genre
      if (search)          params.search = search
      const res = await getGames(params)
      setGames(res.data)
    } catch {
      setGames([])
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    fetchGames()
  }

  const featured = games[0]

  return (
    <div>
      {/* Hero — featured game */}
      {featured && (
        <div className="card flex gap-5 mb-8 items-center">
          <div className="w-32 h-20 bg-border rounded-lg flex-shrink-0 overflow-hidden">
            {featured.cover_image
              ? <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-muted text-xs">No img</div>
            }
          </div>
          <div>
            <p className="text-primary font-bold text-lg">{featured.title}</p>
            <p className="text-muted text-sm mb-3">{featured.genre} · {featured.description?.slice(0, 60)}...</p>
            <a href={`/game/${featured.game_id}`}
              className="inline-block bg-accent text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-500 transition-colors">
              Buy now — ₱{Number(featured.price).toFixed(2)}
            </a>
          </div>
        </div>
      )}

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <button type="submit" className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors whitespace-nowrap">
          Search
        </button>
      </form>

      {/* Genre chips */}
      <div className="flex gap-2 flex-wrap mb-6">
        {GENRES.map(g => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`text-xs px-4 py-1.5 rounded-full border transition-colors
              ${genre === g
                ? 'bg-border border-accent text-accent'
                : 'border-border text-muted hover:border-subtle hover:text-primary'
              }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Game grid */}
      <h2 className="text-primary font-semibold text-base mb-4">
        {genre === 'All' ? 'All games' : genre}
        <span className="text-muted font-normal text-sm ml-2">({games.length})</span>
      </h2>

      {loading ? (
        <div className="text-center text-muted py-20">Loading games...</div>
      ) : games.length === 0 ? (
        <div className="text-center text-muted py-20">No games found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {games.map(game => <GameCard key={game.game_id} game={game} />)}
        </div>
      )}
    </div>
  )
}
