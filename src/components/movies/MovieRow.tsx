import MovieCard from '@/components/movies/MovieCard'
import { Movie } from '@/types/tmdb'

interface MovieRowProps {
  title: string
  movies: Movie[]
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-2xl text-ivory px-1">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-40 md:w-48">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  )
}