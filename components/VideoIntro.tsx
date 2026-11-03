'use client'

import { useEffect, useRef, useState } from 'react'

// Video-Intro: Blick über Akkis Schulter, die Kamera fährt auf die Platte, bis das Logo das Bild fast füllt.
// Dann übernimmt eine echte Platte mit dem Logo als Label genau an dieser Stelle: Sie dreht schneller,
// wird kleiner, das Video verschwindet, und nur das Logo fliegt drehend an seinen Platz in der Kopfzeile.
// Läuft beim ersten Besuch von selbst, danach über den Button „Intro ansehen“.

const SEEN_KEY = 'djakki-video-intro'
export const REPLAY_EVENT = 'djakki:intro'

// Lage des Logo-Labels im letzten Videobild, als Anteil von Breite/Höhe des Videos (aus dem Video gemessen)
const LABEL_X = 0.4937
const LABEL_Y = 0.4741
const LABEL_H = 0.885 // Durchmesser des Labels als Anteil der Videohöhe
const LABEL = 0.36 // Anteil des Labels am Durchmesser der Platte (Foto vinyl.webp)

// Auf schmalen Bildschirmen zeigt der Ausschnitt anfangs die Schulter rechts und wandert bis zum Ende zum Label
const NARROW_START_X = 0.64

// Ablauf der Übergabe, Sekunden ab Videoende
const HANDOFF = {
  appear: [0, 0.25], // echte Platte blendet über dem Video ein
  shrink: [0.15, 1.2], // Platte wird kleiner
  stageOut: [0.35, 1.15], // Video verschwindet, die Seite kommt durch
  vinylOut: [0.95, 1.35], // nur das Logo bleibt
  fly: [1.2, 2.3], // Logo fliegt in die Kopfzeile
}
const HANDOFF_END = HANDOFF.fly[1]
const REVS = 6 // ganze Umdrehungen während der Übergabe, damit das Logo aufrecht landet

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const span = (t: number, [a, b]: number[]) => clamp01((t - a) / (b - a))
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2
const smoothstep = (x: number) => x * x * (3 - 2 * x)

export default function VideoIntro() {
  const video = useRef<HTMLVideoElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const disc = useRef<HTMLDivElement>(null)
  const spinner = useRef<HTMLDivElement>(null)
  const vinyl = useRef<HTMLImageElement>(null)
  const [skipping, setSkipping] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const el = video.current
    if (!el) return
    let running = false
    let raf = 0
    let skipTimer = 0
    let prevOverflow = ''

    const narrow = () => window.innerWidth < 768

    // Bildausschnitt des Videos: wandert auf dem Handy von der Schulter zur Bildmitte mit dem Label
    function objectX() {
      if (!narrow() || !el!.duration) return 0.5
      return lerp(NARROW_START_X, LABEL_X, smoothstep(clamp01(el!.currentTime / el!.duration)))
    }

    // Wo das Label des letzten Videobilds auf dem Bildschirm liegt (object-fit: cover)
    function labelOnScreen() {
      const W = window.innerWidth
      const H = window.innerHeight
      const vw = el!.videoWidth || 1920
      const vh = el!.videoHeight || 1080
      const scale = Math.max(W / vw, H / vh)
      const w = vw * scale
      const h = vh * scale
      const ox = (W - w) * objectX()
      const oy = (H - h) * 0.5
      return { x: ox + LABEL_X * w, y: oy + LABEL_Y * h, d: LABEL_H * h }
    }

    function finish() {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
      window.clearTimeout(skipTimer)
      try {
        localStorage.setItem(SEEN_KEY, '1')
      } catch {
        // ohne Speicher läuft das Intro eben beim nächsten Besuch wieder
      }
      el!.pause()
      root.classList.remove('site-intro')
      document.body.style.overflow = prevOverflow
      setSkipping(false)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }

    // Überspringen blendet weich aus statt hart abzuschneiden
    function skip() {
      if (!running) return
      setSkipping(true)
      window.clearTimeout(skipTimer)
      skipTimer = window.setTimeout(finish, 450)
    }

    function resetLayers() {
      stage.current!.style.opacity = '1'
      disc.current!.style.opacity = '0'
      vinyl.current!.style.opacity = '1'
      el!.style.objectPosition = `${objectX() * 100}% 50%`
    }

    // Übergabe vom Video an die echte Platte und den Flug in die Kopfzeile
    function handoff() {
      const logo = document.getElementById('header-logo')
      if (!logo) return finish()
      const start = labelOnScreen()
      const size = start.d / LABEL // Durchmesser der ganzen Platte, deren Label auf dem Video-Label liegt
      disc.current!.style.width = `${size}px`
      disc.current!.style.height = `${size}px`
      const mid = Math.min(window.innerWidth, window.innerHeight) * 0.62 / size
      let t0 = 0

      function frame(now: number) {
        if (!running) return
        if (!t0) t0 = now
        const t = (now - t0) / 1000
        const r = logo!.getBoundingClientRect()
        const end = r.width / (LABEL * size)

        const shrink = easeInOutCubic(span(t, HANDOFF.shrink))
        const fly = easeInOutCubic(span(t, HANDOFF.fly))
        const cx = lerp(lerp(start.x, window.innerWidth / 2, shrink), r.left + r.width / 2, fly)
        const cy = lerp(lerp(start.y, window.innerHeight / 2, shrink), r.top + r.height / 2, fly)
        const s = lerp(lerp(1, Math.min(1, mid), shrink), end, fly)
        disc.current!.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) scale(${s})`
        spinner.current!.style.transform = `rotate(${360 * REVS * easeInOutSine(clamp01(t / HANDOFF_END))}deg)`

        disc.current!.style.opacity = String(span(t, HANDOFF.appear))
        stage.current!.style.opacity = String(1 - span(t, HANDOFF.stageOut))
        vinyl.current!.style.opacity = String(1 - span(t, HANDOFF.vinylOut))

        if (t >= HANDOFF_END) finish()
        else raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }

    function onTime() {
      if (running) el!.style.objectPosition = `${objectX() * 100}% 50%`
    }

    function onEnded() {
      if (running) handoff()
    }

    function play() {
      if (running) return
      running = true
      // Das Logo landet in der Kopfzeile über dem Hero, daher immer vom Seitenanfang aus
      window.scrollTo(0, 0)
      root.classList.add('site-intro')
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      setSkipping(false)
      el!.currentTime = 0
      resetLayers()
      // Blockiert der Browser das Abspielen, geht es ohne Intro direkt zur Seite
      el!.play().catch(finish)
      // Erst nach dem auslösenden Klick zuhören, sonst würde der Button das Intro sofort überspringen
      setTimeout(() => {
        if (!running) return
        window.addEventListener('pointerdown', skip)
        window.addEventListener('keydown', skip)
      }, 0)
    }

    el.addEventListener('timeupdate', onTime)
    el.addEventListener('ended', onEnded)
    el.addEventListener('error', finish)

    // Erster Besuch: das Script im <head> hat das Intro bereits angemeldet
    if (root.classList.contains('site-intro')) play()

    function replay() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      play()
    }
    window.addEventListener(REPLAY_EVENT, replay)

    return () => {
      window.removeEventListener(REPLAY_EVENT, replay)
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('error', finish)
      // Aufräumen stoppt nur; als gesehen gilt das Intro erst, wenn es gelaufen oder übersprungen ist
      if (running) {
        running = false
        cancelAnimationFrame(raf)
        window.clearTimeout(skipTimer)
        el.pause()
        document.body.style.overflow = prevOverflow
        window.removeEventListener('pointerdown', skip)
        window.removeEventListener('keydown', skip)
      }
    }
  }, [])

  return (
    <div className={`site-intro-overlay fixed inset-0 z-[70] ${skipping ? 'is-leaving' : ''}`} aria-hidden="true">
      <div ref={stage} className="absolute inset-0 bg-black">
        <video
          ref={video}
          className="h-full w-full object-cover"
          src="/intro/dj-akki-intro.mp4"
          poster="/intro/dj-akki-intro.jpg"
          muted
          playsInline
          preload="none"
        />
        <div className="site-intro-vignette pointer-events-none absolute inset-0" />
        <div className="container-page pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 pb-6 text-paper md:pb-7">
          <p className="font-display text-xl font-medium uppercase tracking-label md:text-2xl">DJ Akki &amp; Friends</p>
          <span className="shrink-0 whitespace-nowrap text-sm text-gray-400">Überspringen</span>
        </div>
      </div>

      {/* Echte Platte mit dem Logo als Label, übernimmt am Videoende */}
      <div ref={disc} className="intro-disc absolute left-0 top-0" style={{ opacity: 0 }}>
        <div ref={spinner} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={vinyl} src="/intro/vinyl.webp" alt="" className="absolute inset-0 h-full w-full" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/dj-akki-friends.png"
            alt=""
            className="absolute rounded-full bg-paper"
            style={{ inset: `${((1 - LABEL) / 2) * 100}%`, width: `${LABEL * 100}%`, height: `${LABEL * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
