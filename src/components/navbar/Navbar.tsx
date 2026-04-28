'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled
          ? 'bg-surface/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
        }
      `}
    >
      <nav className="px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => {
            router.push(`/?reset=${Date.now()}`)
            setTimeout(() => router.replace('/'), 100)
          }}
          className="font-display text-xl text-ivory tracking-widest"
        >
          OBSCURA
        </button>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/">Explorar</NavLink>
          <NavLink href="/coleccion">Mi Colección</NavLink>
          <button className="text-muted hover:text-ivory transition-colors duration-200">
            <Search size={18} />
          </button>
        </div>

        {/* Mobile: search + hamburguesa */}
        <div className="flex md:hidden items-center gap-4">
          <button className="text-muted hover:text-ivory transition-colors duration-200">
            <Search size={18} />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-muted hover:text-ivory transition-colors duration-200"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border px-6 py-4 flex flex-col gap-4">
          <Link href="/" className="text-ivory hover:text-amber transition-colors duration-200">
            Explorar
          </Link>
          <Link href="/coleccion" className="text-ivory hover:text-amber transition-colors duration-200">
            Mi Colección
          </Link>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-muted hover:text-ivory transition-colors duration-200 group"
    >
      {children}
      <span className="
        absolute -bottom-1 left-1/2 -translate-x-1/2
        h-px bg-amber
        w-0 group-hover:w-full
        transition-all duration-300
      "/>
    </Link>
  )
}