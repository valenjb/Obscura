export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  original_language: string
  popularity: number
}

export interface MovieDetails extends Movie {
  runtime: number | null
  genres: { id: number; name: string }[]
  production_countries: { iso_3166_1: string; name: string }[]
  spoken_languages: { name: string }[]
  credits?: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos?: {
    results: Video[]
  }
  similar?: {
    results: Movie[]
  }
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}