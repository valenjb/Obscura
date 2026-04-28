'use client'

import { useState, useCallback, useEffect } from 'react'
import { Movie } from '@/types/tmdb'
import { Filters } from '@/components/filters/FilterSidebar'
import MovieRow from '@/components/movies/MovieRow'
import MovieCard from '@/components/movies/MovieCard'
import FilterSidebar from '@/components/filters/FilterSidebar'
import SearchBar from '@/components/ui/SearchBar'
import { SlidersHorizontal } from 'lucide-react'

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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [activeFilters, setActiveFilters] = useState<Filters | null>(null)

  useEffect(() => {
    setSidebarOpen(false)
  }, [])

  const fetchFilteredMovies = useCallback(async (filters: Filters, page: number) => {
    const params = new URLSearchParams()
    params.set('language', 'es')
    params.set('sort_by', 'vote_average.desc')
    params.set('page', page.toString())

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

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` }
      }
    )
    const data = await res.json()
    setFilteredResults(data.results)
    setTotalPages(Math.min(data.total_pages, 500))
    setTotalResults(data.total_results)
  }, [])

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
      filters.director.trim() !== '' ||
      filters.actor.trim() !== ''

    if (!hasFilters) {
      setFilteredResults(null)
      setActiveFilters(null)
      setCurrentPage(1)
      setTotalPages(0)
      setTotalResults(0)
      return
    }

    setActiveFilters(filters)
    setCurrentPage(1)

    if (filters.director.trim() !== '') {
      const personRes = await fetch(`/api/search-director?query=${encodeURIComponent(filters.director)}`)
      const personData = await personRes.json()

      if (personData.results.length === 0) {
        setFilteredResults([])
        return
      }

      const directorId = personData.results[0].id
      const creditsRes = await fetch(
        `https://api.themoviedb.org/3/person/${directorId}/movie_credits?language=es`,
        {
          headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
        }
      )
      const creditsData = await creditsRes.json()
      const directedMovies = creditsData.crew?.filter((m: { job: string }) => m.job === 'Director') ?? []
      setFilteredResults(directedMovies)
      setTotalResults(directedMovies.length)
      return
    }

    if (filters.actor.trim() !== '') {
      const personRes = await fetch(`/api/search-actor?query=${encodeURIComponent(filters.actor)}`)
      const personData = await personRes.json()

      if (personData.results.length === 0) {
        setFilteredResults([])
        return
      }

      const actorId = personData.results[0].id
      const creditsRes = await fetch(
        `https://api.themoviedb.org/3/person/${actorId}/movie_credits?language=es`,
        {
          headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
        }
      )
      const creditsData = await creditsRes.json()
      const actedMovies = creditsData.cast ?? []
      setFilteredResults(actedMovies)
      setTotalResults(actedMovies.length)
      return
    }

    await fetchFilteredMovies(filters, 1)
  }, [fetchFilteredMovies])

  const handlePageChange = useCallback(async (page: number) => {
    if (!activeFilters) return
    setCurrentPage(page)
    await fetchFilteredMovies(activeFilters, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeFilters, fetchFilteredMovies])

  const showingFiltered = filteredResults !== null
  const showingSearch = searchResults !== null

  return (
    <div className={`flex min-w-0 ${sidebarOpen ? 'gap-8' : 'gap-0'}`}>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar con animación */}
      <div className={`
        flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out
        sticky top-24 self-start h-[calc(100vh-6rem)] overflow-y-auto sidebar-scrollbar
        z-20
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
              {isSearching
                ? 'Buscando...'
                : `${searchResults!.length} resultados para tu búsqueda`
              }
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
              {(filteredResults?.length ?? 0) > 0
                ? `${totalResults} películas encontradas`
                : 'Sin resultados'
              }
            </h2>
            {(filteredResults?.length ?? 0) > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredResults!.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Paginador */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
                    
                    {/* Flecha izquierda */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded text-sm text-muted hover:text-ivory disabled:opacity-30 transition-colors duration-200"
                    >
                      ←
                    </button>

                    {/* Primera página siempre visible */}
                    {currentPage > 3 && (
                      <>
                        <button onClick={() => handlePageChange(1)}
                          className="px-3 py-1 rounded text-sm text-muted hover:text-ivory transition-colors duration-200">
                          1
                        </button>
                        {currentPage > 4 && <span className="text-muted text-sm">...</span>}
                      </>
                    )}

                    {/* Páginas alrededor de la actual */}
                    {Array.from(
                      { length: Math.min(currentPage + 2, totalPages) - Math.max(currentPage - 2, 1) + 1 },
                      (_, i) => Math.max(currentPage - 2, 1) + i
                    ).map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`
                            px-3 py-1 rounded text-sm transition-colors duration-200
                            ${currentPage === page
                              ? 'bg-amber text-background font-medium'
                              : 'text-muted hover:text-ivory'
                            }
                          `}
                        >
                          {page}
                        </button>
                      ))
                    }

                    {/* Última página siempre visible */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="text-muted text-sm">...</span>}
                        <button onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-1 rounded text-sm text-muted hover:text-ivory transition-colors duration-200">
                          {totalPages}
                        </button>
                      </>
                    )}

                    {/* Flecha derecha */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded text-sm text-muted hover:text-ivory disabled:opacity-30 transition-colors duration-200"
                    >
                      →
                    </button>

                    {currentPage === 500 && (
                      <p className="text-muted text-xs text-center w-full pt-2">
                        Estás viendo el límite de resultados disponibles. Combiná más filtros para encontrar exactamente lo que buscás.
                      </p>
                    )}
                  </div>
                )}
              </>
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