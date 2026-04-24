'use client'

import { useState, useEffect } from 'react'
import MovieCard from '@/components/movies/MovieCard'
import Link from 'next/link'
import { Movie } from '@/types/tmdb'

export default function ColeccionPage() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'watched'>('watchlist')
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [watched, setWatched] = useState<Movie[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') ?? '[]')
    const savedWatched = JSON.parse(localStorage.getItem('watched') ?? '[]')
    setWatchlist(savedWatchlist)
    setWatched(savedWatched)
  }, [])

  if (!mounted) return null

  const currentMovies = activeTab === 'watchlist' ? watchlist : watched
  const isEmpty = currentMovies.length === 0

  return (
    <main className="min-h-screen pt-24 px-8 pb-8">

      {/* Header */}
      <h1 className="font-display text-4xl text-ivory mb-8">Mi Colección</h1>

      {/* Tabs con sliding indicator */}
      <div className="relative flex gap-8 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`pb-3 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'watchlist' ? 'text-ivory' : 'text-muted hover:text-ivory'
          }`}
        >
          Mi Lista ({watchlist.length})
        </button>
        <button
          onClick={() => setActiveTab('watched')}
          className={`pb-3 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'watched' ? 'text-ivory' : 'text-muted hover:text-ivory'
          }`}
        >
          Vistas ({watched.length})
        </button>

        {/* Sliding indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-amber transition-all duration-300"
          style={{
            width: activeTab === 'watchlist' ? '72px' : '56px',
            left: activeTab === 'watchlist' ? '0px' : '96px',
          }}
        />
      </div>

      {/* Contenido */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="text-6xl text-muted">
            {activeTab === 'watchlist' ? '🔖' : '✓'}
          </span>
          <p className="text-ivory text-lg font-display">
            {activeTab === 'watchlist'
              ? 'Todavía no guardaste ninguna película'
              : 'Todavía no marcaste ninguna película como vista'
            }
          </p>
          <Link
            href="/"
            className="text-amber hover:text-ivory transition-colors duration-200 text-sm"
          >
            Ir a Explorar →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

    </main>
  )
}