'use client'

import { useEffect, useRef, useState } from 'react'

const GHOSTS = 6 // Kopien, die dem Schriftzug als Kaskade vorausfallen

// Schwarzer Kasten mit „30 Jahre am Pult“: Sobald er ins Bild kommt, ergießt sich der Schriftzug von oben als
// Kaskade aus Kopien über die Fläche und kommt nach 1,2 s unten zum Stehen – so lange wie das Hero-Foto braucht.
export default function CascadeTitle({ text, className = '' }: { text: string; className?: string }) {
  const tile = useRef<HTMLDivElement>(null)
  const words = useRef<HTMLDivElement>(null)
  const [falling, setFalling] = useState(false)

  useEffect(() => {
    const box = tile.current
    const inner = words.current
    if (!box || !inner) return

    // Fallhöhe: von ganz oberhalb des Kastens bis zur Ruheposition des Schriftzugs
    const measure = () => inner.style.setProperty('--fall', `${inner.offsetTop + inner.offsetHeight}px`)
    measure()
    window.addEventListener('resize', measure)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setFalling(true)
        io.disconnect()
      },
      { threshold: 0.4 },
    )
    io.observe(box)
    return () => {
      io.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={tile} className={`relative overflow-hidden ${className}`}>
      <div ref={words} className={`cascade relative ${falling ? 'is-falling' : ''}`}>
        {Array.from({ length: GHOSTS }, (_, i) => (
          <p
            key={i}
            aria-hidden="true"
            className="cascade-copy cascade-ghost absolute inset-0 font-display text-title font-semibold uppercase"
            style={{ '--n': i, '--o': 0.12 + 0.08 * i } as React.CSSProperties}
          >
            {text}
          </p>
        ))}
        <p className="cascade-copy cascade-lead relative font-display text-title font-semibold uppercase" style={{ '--n': GHOSTS } as React.CSSProperties}>
          {text}
        </p>
      </div>
    </div>
  )
}
