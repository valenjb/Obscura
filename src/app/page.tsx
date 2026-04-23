import { getTrending } from '@/lib/tmdb'

export default async function Home() {
  const movies = await getTrending()

  return (
    <main className="min-h-screen pt-24 p-8">
      <h1 className="text-amber font-display text-4xl mb-8">Obscura</h1>
      <div className="flex flex-col gap-2">
        {movies.slice(0, 5).map((movie) => (
          <p key={movie.id} className="text-ivory">
            {movie.title} — {movie.release_date.slice(0, 4)}
          </p>
        ))}
      </div>
    </main>
  )
}