'use client'

import { useEffect, useRef } from 'react'

// Kurzes Intro beim ersten Besuch: Eine Platte mit dem Logo als Label wird aufgelegt, läuft an
// und landet dann als Logo in der Kopfzeile. Antippen oder eine Taste überspringt es.

const SEEN_KEY = 'djakki-record-intro'
const LABEL = 0.4 // Anteil des Labels am Plattendurchmesser
const REVS = 3 // ganze Umdrehungen, damit das Logo am Ende aufrecht steht

const SLIDE_END = 0.7
const ARM = [0.75, 1.25] // Tonarm schwenkt auf die Platte
const LAND = [1.95, 2.75] // Platte fliegt in die Kopfzeile
const TOTAL = LAND[1]

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2
const span = (t: number, [a, b]: number[]) => clamp01((t - a) / (b - a))

export default function RecordIntro() {
  const backdrop = useRef<HTMLDivElement>(null)
  const mover = useRef<HTMLDivElement>(null)
  const spinner = useRef<HTMLDivElement>(null)
  const arm = useRef<SVGGElement>(null)
  const armWrap = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('record-intro')) return
    const logo = document.getElementById('header-logo')
    if (!logo || !mover.current) {
      root.classList.remove('record-intro')
      return
    }

    let raf = 0
    let start = 0
    let finished = false
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function finish() {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      try {
        localStorage.setItem(SEEN_KEY, '1')
      } catch {
        // ohne Speicher läuft das Intro eben jedes Mal
      }
      root.classList.remove('record-intro')
      document.body.style.overflow = prevOverflow
      window.removeEventListener('pointerdown', finish)
      window.removeEventListener('keydown', finish)
    }

    function frame(now: number) {
      if (finished) return
      if (!start) start = now
      const t = (now - start) / 1000
      const size = mover.current!.offsetWidth

      // Ziel: das Label soll genau auf dem Logo in der Kopfzeile landen
      const r = logo!.getBoundingClientRect()
      const tx = r.left + r.width / 2 - window.innerWidth / 2
      const ty = r.top + r.height / 2 - window.innerHeight / 2
      const endScale = r.width / LABEL / size

      const slide = easeOutCubic(clamp01(t / SLIDE_END))
      const land = easeInOutCubic(span(t, LAND))
      const x = lerp(window.innerWidth * 0.75 * (1 - slide), tx, land)
      const y = lerp(0, ty, land)
      const s = lerp(1, endScale, land)
      mover.current!.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${s})`

      // Anlaufen und Auslaufen wie auf einem Plattenteller
      spinner.current!.style.transform = `rotate(${360 * REVS * easeInOutSine(clamp01(t / TOTAL))}deg)`

      // Rillen und Glanz verschwinden beim Landen, übrig bleibt nur das Label = das Logo
      mover.current!.style.setProperty('--vinyl', String(1 - span(t, [LAND[0] + 0.25, LAND[1] - 0.05])))
      backdrop.current!.style.opacity = String(1 - span(t, [LAND[0], LAND[1] - 0.1]))

      const armIn = span(t, [SLIDE_END - 0.1, ARM[0]])
      const armOut = span(t, [LAND[0] - 0.2, LAND[0] + 0.1])
      armWrap.current!.style.opacity = String(armIn * (1 - armOut))
      const swing = easeInOutCubic(span(t, ARM)) - easeInOutCubic(span(t, [LAND[0] - 0.35, LAND[0]]))
      arm.current!.style.transform = `rotate(${lerp(-32, 0, swing)}deg)`

      if (t >= TOTAL) finish()
      else raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    window.addEventListener('pointerdown', finish)
    window.addEventListener('keydown', finish)

    // Aufräumen stoppt nur; als gesehen gilt das Intro erst, wenn es gelaufen oder übersprungen ist
    return () => {
      finished = true
      cancelAnimationFrame(raf)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('pointerdown', finish)
      window.removeEventListener('keydown', finish)
    }
  }, [])

  return (
    <div className="record-intro-overlay fixed inset-0 z-[70]" aria-hidden="true">
      <div ref={backdrop} className="absolute inset-0 bg-ink" />
      <div ref={mover} className="record absolute left-1/2 top-1/2">
        <div className="record-fade record-shadow absolute inset-0 rounded-full" />
        {/* Rillen und Label drehen sich, der Lichtreflex darüber steht still – so wirkt die Platte echt */}
        <div ref={spinner} className="absolute inset-0">
          <div className="record-fade record-grooves absolute inset-0 rounded-full" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/dj-akki-friends.png"
            alt=""
            className="absolute rounded-full bg-paper"
            style={{ inset: `${((1 - LABEL) / 2) * 100}%`, width: `${LABEL * 100}%`, height: `${LABEL * 100}%` }}
          />
        </div>
        <div className="record-fade record-shine absolute inset-0 rounded-full" />
        <svg ref={armWrap} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" style={{ opacity: 0 }}>
          <g ref={arm} className="tonearm">
            <circle cx="104" cy="6" r="7" fill="#2b2d33" stroke="#4a4d55" strokeWidth="1" />
            <circle cx="104" cy="6" r="2.5" fill="#8d9099" />
            <path d="M104 6 L96 46 L79 70" fill="none" stroke="#b9bcc4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="73" y="67" width="10" height="6" rx="1.2" transform="rotate(-36 78 70)" fill="#2b2d33" stroke="#8d9099" strokeWidth="0.8" />
          </g>
        </svg>
      </div>
    </div>
  )
}
