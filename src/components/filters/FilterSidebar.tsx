'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'

const GENRES = [
  { id: 28,    name: 'Acción' },
  { id: 12,    name: 'Aventura' },
  { id: 16,    name: 'Animación' },
  { id: 35,    name: 'Comedia' },
  { id: 80,    name: 'Crimen' },
  { id: 99,    name: 'Documental' },
  { id: 18,    name: 'Drama' },
  { id: 10751, name: 'Familia' },
  { id: 14,    name: 'Fantasía' },
  { id: 36,    name: 'Historia' },
  { id: 27,    name: 'Terror' },
  { id: 10402, name: 'Música' },
  { id: 9648,  name: 'Misterio' },
  { id: 10749, name: 'Romance' },
  { id: 878,   name: 'Ciencia ficción' },
  { id: 53,    name: 'Thriller' },
  { id: 10770, name: 'Película de TV' },
  { id: 10752, name: 'Guerra' },
  { id: 37,    name: 'Western' },
]

const DECADES = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]

const COUNTRIES = [
  { code: 'FR', name: 'Francia' },
  { code: 'IT', name: 'Italia' },
  { code: 'JP', name: 'Japón' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'AR', name: 'Argentina' },
  { code: 'ES', name: 'España' },
  { code: 'DE', name: 'Alemania' },
  { code: 'KR', name: 'Corea del Sur' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'MX', name: 'México' },
  { code: 'BR', name: 'Brasil' },
  { code: 'IR', name: 'Irán' },
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Rusia' },
  { code: 'SE', name: 'Suecia' },
]

export interface Filters {
  genres: number[]
  decades: number[]
  countries: string[]
  director: string
  actor: string
}

interface FilterSidebarProps {
  onFiltersChange: (filters: Filters) => void
  onClose: () => void
}

export default function FilterSidebar({ onFiltersChange, onClose }: FilterSidebarProps) {
  const [genres, setGenres] = useState<number[]>([])
  const [decades, setDecades] = useState<number[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [director, setDirector] = useState('')
  const [actor, setActor] = useState('')

  function toggleGenre(id: number) {
    const updated = genres.includes(id)
      ? genres.filter(g => g !== id)
      : [...genres, id]
    setGenres(updated)
    onFiltersChange({ genres: updated, decades, countries, director, actor })
  }

  function toggleDecade(decade: number) {
    const updated = decades.includes(decade)
      ? decades.filter(d => d !== decade)
      : [...decades, decade]
    setDecades(updated)
    onFiltersChange({ genres, decades: updated, countries, director, actor })
  }

  function toggleCountry(code: string) {
    const updated = countries.includes(code)
      ? countries.filter(c => c !== code)
      : [...countries, code]
    setCountries(updated)
    onFiltersChange({ genres, decades, countries: updated, director, actor })
  }

  function handleDirector(value: string) {
    setDirector(value)
    onFiltersChange({ genres, decades, countries, director: value, actor })
  }

  function handleActor(value: string) {
    setActor(value)
    onFiltersChange({ genres, decades, countries, director, actor: value })
  }

  function clearFilters() {
    setGenres([])
    setDecades([])
    setCountries([])
    setDirector('')
    setActor('')
    onFiltersChange({ genres: [], decades: [], countries: [], director: '', actor: '' })
  }

  const hasFilters = genres.length > 0 || decades.length > 0 || countries.length > 0 || director !== '' || actor !== ''

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-6 pr-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-200"
        >
          <SlidersHorizontal size={16} className="text-amber" />
          <span className="text-ivory font-medium">Filtros</span>
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-muted text-xs hover:text-amber transition-colors duration-200"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Director */}
      <div className="flex flex-col gap-2">
        <label className="text-muted text-xs uppercase tracking-wider">Director</label>
        <input
          type="text"
          value={director}
          onChange={e => handleDirector(e.target.value)}
          placeholder="Ej: Kubrick, Fellini..."
          className="
            bg-surface-elevated border border-border rounded px-3 py-2
            text-ivory text-sm placeholder:text-muted
            focus:outline-none focus:border-amber
            transition-colors duration-200
          "
        />
      </div>

      {/* Actor */}
      <div className="flex flex-col gap-2">
        <label className="text-muted text-xs uppercase tracking-wider">Actor</label>
        <input
          type="text"
          value={actor}
          onChange={e => handleActor(e.target.value)}
          placeholder="Ej: Pacino, Streep..."
          className="
            bg-surface-elevated border border-border rounded px-3 py-2
            text-ivory text-sm placeholder:text-muted
            focus:outline-none focus:border-amber
            transition-colors duration-200
          "
        />
      </div>

      {/* País */}
      <div className="flex flex-col gap-2">
      <label className="text-muted text-xs uppercase tracking-wider">País</label>
      <div className="flex flex-wrap gap-2">
          {COUNTRIES.map(c => (
           <button
              key={c.code}
              onClick={() => toggleCountry(c.code)}
              className={`
              px-2 py-1 rounded text-xs font-medium
              transition-colors duration-200
              ${countries.includes(c.code)
                  ? 'bg-amber text-background'
                  : 'bg-surface-elevated text-muted hover:text-ivory border border-border'
              }
              `}
          >
              {c.name}
          </button>
          ))}
      </div>
      </div>

      {/* Década */}
      <div className="flex flex-col gap-2">
        <label className="text-muted text-xs uppercase tracking-wider">Década</label>
        <div className="flex flex-wrap gap-2">
          {DECADES.map(decade => (
            <button
              key={decade}
              onClick={() => toggleDecade(decade)}
              className={`
                px-2 py-1 rounded text-xs font-medium
                transition-colors duration-200
                ${decades.includes(decade)
                  ? 'bg-amber text-background'
                  : 'bg-surface-elevated text-muted hover:text-ivory border border-border'
                }
              `}
            >
              {decade}s
            </button>
          ))}
        </div>
      </div>

      {/* Género */}
      <div className="flex flex-col gap-2">
        <label className="text-muted text-xs uppercase tracking-wider">Género</label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(genre => (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              className={`
                px-2 py-1 rounded text-xs font-medium
                transition-colors duration-200
                ${genres.includes(genre.id)
                  ? 'bg-amber text-background'
                  : 'bg-surface-elevated text-muted hover:text-ivory border border-border'
                }
              `}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

    </aside>
  )
}