const GENRES = [
  'Action', 'Action RPG', 'Adventure', 'Battle Royale',
  'Fighting', 'FPS', 'Horror', 'Indie',
  'MMO', 'MOBA', 'Open World', 'Platformer',
  'Puzzle', 'Racing', 'RPG', 'Roguelike',
  'Sandbox', 'Shooter', 'Simulation', 'Sports',
  'Stealth', 'Strategy', 'Survival', 'TPS',
  'Tower Defense', 'Turn-Based', 'Visual Novel'
]

export default function GenrePicker({ value, onChange }) {
  // value is a comma-separated string like "Action, RPG"
  const selected = value ? value.split(',').map(g => g.trim()).filter(Boolean) : []

  function toggle(genre) {
    const updated = selected.includes(genre)
      ? selected.filter(g => g !== genre)
      : [...selected, genre]
    onChange(updated.join(', '))
  }

  return (
    <div>
      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map(g => (
            <span key={g}
              className="flex items-center gap-1 bg-accent/20 border border-accent text-accent text-xs px-2 py-1 rounded-full">
              {g}
              <button type="button" onClick={() => toggle(g)}
                className="hover:text-red-400 transition-colors text-sm leading-none">
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Genre grid */}
      <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
        {GENRES.map(g => {
          const isSelected = selected.includes(g)
          return (
            <button
              key={g}
              type="button"
              onClick={() => toggle(g)}
              className={`text-xs px-2 py-2 rounded-lg border text-left transition-colors
                ${isSelected
                  ? 'bg-accent border-accent text-white font-semibold'
                  : 'bg-dark border-border text-muted hover:border-accent hover:text-primary'
                }`}
            >
              {isSelected && <span className="mr-1">✓</span>}
              {g}
            </button>
          )
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-muted mt-2">No genres selected — click to add</p>
      )}
    </div>
  )
}
