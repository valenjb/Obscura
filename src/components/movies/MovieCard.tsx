'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Movie } from '@/types/tmdb'
import { getImageUrl } from '@/lib/tmdb'
import { Bookmark, Eye, Star } from 'lucide-react'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [saved, setSaved] = useState(false)
  const [watched, setWatched] = useState(false)

  const posterUrl = getImageUrl(movie.poster_path, 'w500')
  const year = movie.release_date?.slice(0, 4) ?? '—'

  return (
    <div className="group relative flex flex-col bg-surface rounded-lg overflow-hidden">

      {/* Poster */}
      <div className="relative aspect-[2/3] w-full">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
            <span className="text-muted text-4xl">◻</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="
          absolute inset-0 bg-black/70
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          flex flex-col items-center justify-center gap-3
        ">
          <button
            onClick={() => setSaved(!saved)}
            className={`
              px-4 py-2 rounded text-sm font-medium w-32
              flex items-center justify-center gap-2
              transition-colors duration-200
              ${saved
                ? 'bg-amber text-background'
                : 'border border-ivory text-ivory hover:border-amber hover:text-amber'
              }
            `}
          >
            <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Guardada' : 'Guardar'}
          </button>

          <button
            onClick={() => setWatched(!watched)}
            className={`
              px-4 py-2 rounded text-sm font-medium w-32
              flex items-center justify-center gap-2
              transition-colors duration-200
              ${watched
                ? 'bg-amber text-background'
                : 'border border-ivory text-ivory hover:border-amber hover:text-amber'
              }
            `}
          >
            <Eye size={14} />
            {watched ? 'Vista' : 'Ya la vi'}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {saved && (
            <span className="bg-amber text-background p-1 rounded">
              <Bookmark size={12} fill="currentColor" />
            </span>
          )}
          {watched && (
            <span className="bg-amber text-background p-1 rounded">
              <Eye size={12} />
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <Link href={`/movie/${movie.id}`} className="p-3 flex flex-col gap-1 hover:bg-surface-elevated transition-colors duration-200">
        <h3 className="text-ivory text-sm font-medium leading-tight line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-muted text-xs">
          {year}
        </p>
        <p className="text-amber text-xs font-medium flex items-center gap-1">
          <Star size={10} fill="currentColor" />
          {movie.vote_average.toFixed(1)}
        </p>
      </Link>

    </div>
  )
}