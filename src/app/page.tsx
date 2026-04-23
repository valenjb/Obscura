import { getTrending, getMoviesByGenre, getMoviesByDecade } from '@/lib/tmdb'
import ExploreClient from '@/components/movies/ExploreClient'

export default async function Home() {
  const [trending, arthouse, byDecade] = await Promise.all([
    getTrending(),
    getMoviesByGenre(18),
    getMoviesByDecade(1960),
  ])

  return (
    <main className="min-h-screen pt-24 px-8 pb-8">
      <ExploreClient
        trending={trending}
        arthouse={arthouse}
        byDecade={byDecade}
      />
    </main>
  )
}