import { NextRequest, NextResponse } from 'next/server'
import { searchPerson } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results = await searchPerson(query)
  const actors = results.filter(p => p.known_for_department === 'Acting')

  return NextResponse.json({ results: actors })
}