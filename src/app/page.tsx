import { getTrending, getMoviesByGenre, getMoviesByDecade } from '@/lib/tmdb'
import ExploreClient from '@/components/movies/ExploreClient'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>
}) {
  const { reset } = await searchParams

  const [trending, arthouse, byDecade] = await Promise.all([
    getTrending(),
    getMoviesByGenre(18),
    getMoviesByDecade(1960),
  ])

  return (
    <main className="min-h-screen pt-24 px-8 pb-8">
      <ExploreClient
        key={reset ?? 'default'}
        trending={trending}
        arthouse={arthouse}
        byDecade={byDecade}
      />
    </main>
  )
}