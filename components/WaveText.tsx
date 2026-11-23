'use client'

import { useEffect, useRef, useState } from 'react'

// Überschrift, deren Buchstaben als Welle auftauchen und danach ganz ruhig weiter „atmen“.
// Wörter bleiben zusammen, damit nur zwischen ihnen umbrochen wird; Screenreader lesen den ganzen Text.
export default function WaveText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        io.disconnect()
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  let index = 0
  const words = text.split(' ')

  return (
    <h3 ref={ref} aria-label={text} className={`wave ${visible ? 'is-in' : ''} ${className}`}>
      {words.map((word, w) => (
        // Leerzeichen zwischen den Wort-Blöcken, nicht darin – sonst verschluckt der Browser es
        <span key={w} aria-hidden="true">
          {w > 0 && ' '}
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((letter) => {
              const i = index++
              return (
                <span key={i} className="wave-letter" style={{ '--i': i } as React.CSSProperties}>
                  {letter}
                </span>
              )
            })}
          </span>
        </span>
      ))}
    </h3>
  )
}
