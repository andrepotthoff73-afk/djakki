'use client'

import { useEffect, useState } from 'react'
import { nav } from '@/lib/site'

type Ink = { bg: string; fg: string }

const first: Ink = { bg: 'var(--accent-500)', fg: 'var(--paper)' }

// Feste Kopfzeile, die Grund und Schrift des Kapitels darunter annimmt
export default function Header() {
  const [ink, setInk] = useState<Ink>(first)

  useEffect(() => {
    const chapters = Array.from(document.querySelectorAll<HTMLElement>('[data-bg]'))
    let frame = 0

    function update() {
      frame = 0
      const line = 40
      const hit = chapters.find((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= line && r.bottom > line
      })
      if (hit) setInk({ bg: hit.dataset.bg!, fg: hit.dataset.fg! })
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{ backgroundColor: ink.bg, color: ink.fg, transition: 'background-color 300ms ease, color 300ms ease' }}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-5">
        <a href="#top" className="font-display text-xl font-semibold uppercase leading-none">
          DJ Akki
        </a>
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-5 md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="link decoration-transparent hover:decoration-current">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#kontakt"
          className="btn btn-sm"
          style={{ backgroundColor: ink.fg, color: ink.bg, transition: 'background-color 300ms ease, color 300ms ease, transform 160ms var(--ease-out)' }}
        >
          Termin anfragen
        </a>
      </div>
    </header>
  )
}
