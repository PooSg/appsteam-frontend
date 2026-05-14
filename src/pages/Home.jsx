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

const [slide, setSlide] = useState(0)
const featured = games.slice(0, 5)

function prevSlide() { setSlide(s => (s === 0 ? featured.length - 1 : s - 1)) }
function nextSlide() { setSlide(s => (s === featured.length - 1 ? 0 : s + 1)) }

return (
  <div>
    {/* Hero Carousel */}
    {featured.length > 0 && (
      <div className="relative mb-8 rounded-xl overflow-hidden h-64 bg-border">
        {featured.map((game, i) => (
          <div
            key={game.game_id}
            className={`absolute inset-0 transition-opacity duration-500 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          >
            {game.cover_image && (
              <img src={game.cover_image} alt={game.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-bold text-2xl mb-1">{game.title}</p>
              <p className="text-gray-300 text-sm mb-3">{game.genre} · {game.description?.slice(0, 60)}...</p>
              <a href={`/game/${game.game_id}`}
                className="inline-block bg-accent text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-500 transition-colors">
                Buy now — ₱{Number(game.price).toFixed(2)}
              </a>
            </div>
          </div>
        ))}
        {/* Arrows */}
        <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-black/70 transition-colors">‹</button>
        <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-black/70 transition-colors">›</button>
        {/* Dots */}
        <div className="absolute bottom-2 right-4 flex gap-1">
          {featured.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === slide ? 'bg-accent' : 'bg-white/40'}`}
            />
          ))}
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
