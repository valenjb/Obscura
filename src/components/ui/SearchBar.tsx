'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = 'Buscá por título, director, país...' }: SearchBarProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value, onSearch])

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full bg-surface-elevated border border-border rounded-lg
          pl-12 pr-4 py-3
          text-ivory placeholder:text-muted
          focus:outline-none focus:border-amber
          transition-colors duration-200
        "
      />
    </div>
  )
}