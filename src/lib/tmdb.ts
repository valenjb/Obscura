import { Movie, MovieDetails, TMDBResponse } from '@/types/tmdb'

const BASE_URL = 'https://api.themoviedb.org/3'
const TOKEN = process.env.TMDB_ACCESS_TOKEN

async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`TMDB error: ${response.status}`)
  }

  return response.json()
}

export async function getTrending(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/trending/movie/week')
  return data.results
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<Movie>>(
    `/discover/movie?with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=1000&language=es`
  )
  return data.results
}

export async function getMoviesByDecade(decade: number): Promise<Movie[]> {
  const startYear = decade
  const endYear = decade + 9
  const data = await fetchTMDB<TMDBResponse<Movie>>(
    `/discover/movie?primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&sort_by=vote_average.desc&vote_count.gte=500&language=es`
  )
  return data.results
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(
    `/movie/${id}?append_to_response=credits,videos,similar&language=es`
  )
}

export function getImageUrl(path: string | null, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export async function searchPerson(query: string): Promise<{ id: number; name: string; known_for_department: string }[]> {
  const data = await fetchTMDB<TMDBResponse<{ id: number; name: string; known_for_department: string }>>(
    `/search/person?query=${encodeURIComponent(query)}&language=es`
  )
  return data.results
}