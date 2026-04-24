'use client'

import { useState, useCallback } from 'react'
import { Movie } from '@/types/tmdb'
import { Filters } from '@/components/filters/FilterSidebar'
import MovieRow from '@/components/movies/MovieRow'
import MovieCard from '@/components/movies/MovieCard'
import FilterSidebar from '@/components/filters/FilterSidebar'
import SearchBar from '@/components/ui/SearchBar'
import {SlidersHorizontal } from 'lucide-react'

interface ExploreClientProps {
  trending: Movie[]
  arthouse: Movie[]
  byDecade: Movie[]
}

export default function ExploreClient({ trending, arthouse, byDecade }: ExploreClientProps) {
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null)
  const [filteredResults, setFilteredResults] = useState<Movie[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
        },
      }
    )
    const data = await res.json()
    setSearchResults(data.results)
    setIsSearching(false)
  }, [])

  const handleFiltersChange = useCallback(async (filters: Filters) => {
    const hasFilters = filters.genres.length > 0 ||
      filters.decades.length > 0 ||
      filters.countries.length > 0 ||
      filters.director.trim() !== ''

    if (!hasFilters) {
      setFilteredResults(null)
      return
    }

    const params = new URLSearchParams()
    params.set('language', 'es')
    params.set('sort_by', 'vote_average.desc')
    params.set('vote_count.gte', '200')

    if (filters.genres.length > 0)
      params.set('with_genres', filters.genres.join(','))
    if (filters.countries.length > 0)
      params.set('with_origin_country', filters.countries.join('|'))
    if (filters.decades.length > 0) {
      const minYear = Math.min(...filters.decades)
      const maxYear = Math.max(...filters.decades) + 9
      params.set('primary_release_date.gte', `${minYear}-01-01`)
      params.set('primary_release_date.lte', `${maxYear}-12-31`)
    }

    if (filters.director.trim() !== '') {
      const personRes = await fetch(`/api/search-person?query=${encodeURIComponent(filters.director)}`)
      const personData = await personRes.json()
      
      if (personData.results.length === 0) {
        setFilteredResults([])
        return
      }

      const directorId = personData.results[0].id
      const creditsRes = await fetch(
        `https://api.themoviedb.org/3/person/${directorId}/movie_credits?language=es`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
          },
        }
      )
      const creditsData = await creditsRes.json()
      const directedMovies = creditsData.crew?.filter((m: {job: string}) => m.job === 'Director') ?? []
      setFilteredResults(directedMovies)
      return
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
        },
      }
    )
    const data = await res.json()
    setFilteredResults(data.results)
  }, [])

  const showingFiltered = filteredResults !== null
  const showingSearch = searchResults !== null

  return (
    <div className="flex gap-8">

      {/* Sidebar con animación */}
      <div className={`
        flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'}
      `}>
        <FilterSidebar onFiltersChange={handleFiltersChange} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col gap-10 min-w-0">

        {/* Header toggle + Buscador */}
        <div className="flex items-center gap-4 transition-all duration-300">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <SlidersHorizontal size={16} className="text-amber" />
              <span className="text-ivory font-medium">Filtros</span>
            </button>
          )}
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Resultados de búsqueda */}
        {showingSearch && (
          <section className="flex flex-col gap-4">
            <h2 className="font-display text-2xl text-ivory">
              {isSearching ? 'Buscando...' : `Resultados`}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {searchResults?.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Resultados de filtros */}
        {!showingSearch && showingFiltered && (
          <section className="flex flex-col gap-4">
            <h2 className="font-display text-2xl text-ivory">
              {filteredResults!.length > 0 ? 'Películas encontradas' : 'Sin resultados'}
            </h2>
            {filteredResults!.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredResults!.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="text-muted">Probá con otros filtros.</p>
            )}
          </section>
        )}

        {/* Secciones por defecto */}
        {!showingSearch && !showingFiltered && (
          <>
            <MovieRow title="Tendencias esta semana" movies={trending} />
            <MovieRow title="Cine de autor" movies={arthouse} />
            <MovieRow title="Clásicos del siglo XX" movies={byDecade} />
          </>
        )}

      </div>
    </div>
  )
}