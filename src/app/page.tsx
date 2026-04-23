import { getTrending } from '@/lib/tmdb'
import MovieCard from '@/components/movies/MovieCard'

export default async function Home() {
  const movies = await getTrending()

  return (
    <main className="min-h-screen pt-24 p-8">
      <h1 className="text-amber font-display text-4xl mb-8">Tendencias</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.slice(0, 10).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  )
}