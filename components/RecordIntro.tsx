'use client'

import { useEffect, useRef } from 'react'

// Kurzes Intro: Ein Plattenteller gleitet ins Licht, der Tonarm setzt auf, die Platte mit dem Logo als Label
// läuft eine Weile und schwebt dann als Logo in die Kopfzeile. Läuft beim ersten Besuch von selbst,
// danach über den Button „Intro ansehen“. Antippen oder eine Taste überspringt es.

const SEEN_KEY = 'djakki-record-intro'
export const REPLAY_EVENT = 'djakki:intro'

const LABEL = 0.36 // Anteil des Labels am Plattendurchmesser, deckt das schwarze Papierlabel ab
const REVS = 2 // ganze Umdrehungen, damit das Logo am Ende aufrecht steht
const SHIFT = 0.13 // Teller und Tonarm zusammen mittig: die Platte sitzt etwas links der Mitte

const SLIDE = [0, 0.9]
const ARM_ON = [0.95, 1.65] // Tonarm schwenkt auf die Einlaufrille
const ARM_OFF = [2.45, 2.85] // Tonarm hebt ab und schwenkt zurück
const SPIN = [0.5, 3.7] // Anlaufen und Auslaufen der Platte
const LAND = [2.8, 3.7] // Platte schwebt in die Kopfzeile
const TOTAL = LAND[1]

// Winkel des Tonarms (aus der Geometrie des Fotos berechnet): Ruhestütze rechts und Einlaufrille
const ARM_REST = -52
const ARM_PLAY = -26

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2
const span = (t: number, [a, b]: number[]) => clamp01((t - a) / (b - a))

export default function RecordIntro() {
  const armDeck = useRef<HTMLDivElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const arm = useRef<HTMLImageElement>(null)
  const record = useRef<HTMLDivElement>(null)
  const spinner = useRef<HTMLDivElement>(null)
  const shadow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    let running = false
    let prevOverflow = ''

    function stop(markSeen: boolean) {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
      if (markSeen) {
        try {
          localStorage.setItem(SEEN_KEY, '1')
        } catch {
          // ohne Speicher läuft das Intro eben beim nächsten Besuch wieder
        }
      }
      root.classList.remove('record-intro')
      document.body.style.overflow = prevOverflow
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }

    function skip() {
      stop(true)
    }

    function play() {
      const logo = document.getElementById('header-logo')
      if (running || !logo || !record.current) {
        root.classList.remove('record-intro')
        return
      }
      running = true
      root.classList.add('record-intro')
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      let start = 0

      function frame(now: number) {
        if (!running) return
        if (!start) start = now
        const t = (now - start) / 1000
        const size = record.current!.offsetWidth
        const vw = window.innerWidth

        // Teller samt Platte gleitet von rechts herein und kommt sanft zum Stehen
        const slide = vw * 0.8 * (1 - easeOutCubic(span(t, SLIDE)))
        const deckX = slide - SHIFT * size
        for (const el of [deck.current!, armDeck.current!]) el.style.transform = `translate(-50%, -50%) translate(${deckX}px, 0)`

        // Ziel: das Label landet genau auf dem Logo in der Kopfzeile
        const r = logo!.getBoundingClientRect()
        const tx = r.left + r.width / 2 - vw / 2
        const ty = r.top + r.height / 2 - window.innerHeight / 2
        const endScale = r.width / LABEL / size
        const land = easeInOutCubic(span(t, LAND))
        // Beim Abheben wird die Platte erst ein wenig größer, als würde sie angehoben
        const lift = Math.sin(Math.PI * clamp01(land * 1.6)) * 0.06 * (1 - land)
        const x = lerp(deckX, tx, land)
        const y = lerp(0, ty, land)
        const s = lerp(1, endScale, land) + lift
        record.current!.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${s})`
        spinner.current!.style.transform = `rotate(${360 * REVS * easeInOutSine(span(t, SPIN))}deg)`

        // Vinyl und Schatten blenden aus, übrig bleibt nur das Label = das Logo
        const vinylOut = span(t, [LAND[0] + 0.35, LAND[1] - 0.05])
        record.current!.style.setProperty('--vinyl', String(1 - vinylOut))
        shadow.current!.style.opacity = String((1 - vinylOut) * (0.75 + lift * 4))
        const deckFade = String(1 - span(t, [LAND[0] - 0.1, LAND[0] + 0.45]))
        deck.current!.style.opacity = deckFade
        armDeck.current!.style.opacity = deckFade
        backdrop.current!.style.opacity = String(1 - span(t, [LAND[0] + 0.1, LAND[1] - 0.1]))

        const swing = easeInOutCubic(span(t, ARM_ON)) - easeInOutCubic(span(t, ARM_OFF))
        arm.current!.style.transform = `rotate(${lerp(ARM_REST, ARM_PLAY, swing)}deg)`

        if (t >= TOTAL) stop(true)
        else raf = requestAnimationFrame(frame)
      }

      raf = requestAnimationFrame(frame)
      // Erst nach dem auslösenden Klick zuhören, sonst würde der Button das Intro sofort überspringen
      setTimeout(() => {
        if (!running) return
        window.addEventListener('pointerdown', skip)
        window.addEventListener('keydown', skip)
      }, 0)
    }

    // Erster Besuch: das Script im <head> hat das Intro bereits angemeldet
    if (root.classList.contains('record-intro')) play()

    function replay() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      play()
    }
    window.addEventListener(REPLAY_EVENT, replay)

    // Aufräumen stoppt nur; als gesehen gilt das Intro erst, wenn es gelaufen oder übersprungen ist
    return () => {
      window.removeEventListener(REPLAY_EVENT, replay)
      if (running) {
        running = false
        cancelAnimationFrame(raf)
        document.body.style.overflow = prevOverflow
        window.removeEventListener('pointerdown', skip)
        window.removeEventListener('keydown', skip)
      }
    }
  }, [])

  return (
    <div className="record-intro-overlay fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      <div ref={backdrop} className="record-stage absolute inset-0" />

      {/* Plattenteller und Tonarm bleiben stehen, wenn die Platte abhebt */}
      <div ref={deck} className="record-deck absolute left-1/2 top-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/turntable/platter.webp" alt="" className="record-platter absolute" />
      </div>

      <div ref={record} className="record-disc absolute left-1/2 top-1/2">
        <div ref={shadow} className="record-shadow absolute inset-0 rounded-full" />
        <div ref={spinner} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/turntable/vinyl.webp" alt="" className="record-fade absolute inset-0 h-full w-full" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/dj-akki-friends.png"
            alt=""
            className="record-label absolute rounded-full bg-paper"
            style={{ inset: `${((1 - LABEL) / 2) * 100}%`, width: `${LABEL * 100}%`, height: `${LABEL * 100}%` }}
          />
        </div>
        {/* Stehender, weicher Lichtreflex der Studiolampe */}
        <div className="record-fade record-shine absolute inset-0 rounded-full" />
      </div>

      {/* Tonarm liegt über der Platte, bewegt sich aber mit dem Teller */}
      <div ref={armDeck} className="record-deck absolute left-1/2 top-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={arm} src="/turntable/arm.webp" alt="" className="record-arm absolute" />
      </div>
    </div>
  )
}
