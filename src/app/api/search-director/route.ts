import { NextRequest, NextResponse } from 'next/server'
import { searchPerson } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results = await searchPerson(query)
  const directors = results.filter(p => p.known_for_department === 'Directing')

  return NextResponse.json({ results: directors })
}