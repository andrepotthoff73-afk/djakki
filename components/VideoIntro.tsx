'use client'

import { useEffect, useRef, useState } from 'react'
import { TRACK_FPS, track } from '@/lib/introTrack'

// Video-Intro: Blick über Akkis Schulter, die Kamera fährt auf die Platte, bis das Logo das Bild fast füllt.
// Auf dem Label im Video liegt die ganze Zeit das echte Logo und dreht sich mit 33 Umdrehungen pro Minute –
// es folgt der Kamerafahrt Bild für Bild (Lage vorab aus dem Video gemessen, siehe lib/introTrack.ts).
// Am Ende dreht die Platte schneller, wird kleiner, das Video verschwindet und nur das Logo fliegt
// drehend an seinen Platz in der Kopfzeile. Läuft beim ersten Besuch von selbst, sonst über „Intro ansehen“.

const SEEN_KEY = 'djakki-video-intro'
export const REPLAY_EVENT = 'djakki:intro'

const LABEL = 0.36 // Anteil des Labels am Durchmesser der Platte (Foto vinyl.webp)
const BASE = 1000 // Grundgröße der Platte in px, alles Weitere über transform
const COVER = 1.04 // Logo minimal größer als das Video-Label, damit dessen Rand verschwindet
const RPM_DEG = 200 // 33⅓ Umdrehungen pro Minute in Grad pro Sekunde
const LOAD_TIMEOUT = 4000 // spätestens dann startet das Video, auch wenn es noch lädt

// Das Video-Label ist dunkler beleuchtet als die Logo-Datei; im Flug kehrt die echte Farbe zurück
const VIDEO_LIGHT = { brightness: 0.82, saturate: 1.1 }

// Auf schmalen Bildschirmen zeigt der Ausschnitt anfangs die Schulter rechts und wandert zum Label
const NARROW_START_X = 0.64

// Ablauf der Übergabe, Sekunden ab Videoende
const HANDOFF = {
  vinylIn: [0, 0.3], // Vinyl rund ums Label blendet ein
  shrink: [0.1, 1.2], // Platte wird kleiner
  stageOut: [0.35, 1.15], // Video verschwindet, die Seite kommt durch
  vinylOut: [0.95, 1.35], // nur das Logo bleibt
  fly: [1.2, 2.3], // Logo fliegt in die Kopfzeile
}
const HANDOFF_END = HANDOFF.fly[1]
const EXTRA_SPIN = 2000 // zusätzliche Grad, die die Platte in der Übergabe schneller dreht

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const span = (t: number, [a, b]: number[]) => clamp01((t - a) / (b - a))
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const smoothstep = (x: number) => x * x * (3 - 2 * x)

// Lage des Labels im Video zur Zeit t, zwischen den gemessenen Bildern interpoliert
function labelAt(t: number) {
  const f = clamp01((t * TRACK_FPS) / (track.length - 1)) * (track.length - 1)
  const i = Math.min(track.length - 2, Math.floor(f))
  const k = f - i
  const [ax, ay, aa, ab, ag] = track[i]
  const [bx, by, ba, bb, bg] = track[i + 1]
  return { x: lerp(ax, bx, k), y: lerp(ay, by, k), a: lerp(aa, ba, k), b: lerp(ab, bb, k), angle: lerp(ag, bg, k) }
}

export default function VideoIntro() {
  const video = useRef<HTMLVideoElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const disc = useRef<HTMLDivElement>(null)
  const spinner = useRef<HTMLDivElement>(null)
  const vinyl = useRef<HTMLImageElement>(null)
  const label = useRef<HTMLImageElement>(null)
  const [skipping, setSkipping] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const el = video.current
    if (!el) return
    let running = false
    let raf = 0
    let skipTimer = 0
    let loadTimer = 0
    let prevOverflow = ''
    // Zeitbezug des zuletzt angezeigten Videobilds, für eine ruckelfreie Zeit zwischen den Bildern
    let frameMedia = 0
    let frameAt = 0
    let endedAt = 0

    const narrow = () => window.innerWidth < 768

    // Bildausschnitt des Videos: wandert auf dem Handy von der Schulter zur Bildmitte mit dem Label
    function objectX(t: number) {
      if (!narrow() || !el!.duration) return 0.5
      return lerp(NARROW_START_X, track[track.length - 1][0], smoothstep(clamp01(t / el!.duration)))
    }

    // Umrechnung von Videokoordinaten auf den Bildschirm (object-fit: cover)
    function toScreen(t: number) {
      const W = window.innerWidth
      const H = window.innerHeight
      const vw = el!.videoWidth || 1912
      const vh = el!.videoHeight || 1080
      const scale = Math.max(W / vw, H / vh)
      const w = vw * scale
      const h = vh * scale
      return { ox: (W - w) * objectX(t), oy: (H - h) * 0.5, w, h }
    }

    // Zeit zwischen zwei Videobildern fortschreiben, aber nie weiter als ein Bild voraus
    function videoTime(now: number) {
      if (el!.paused || !frameAt) return el!.currentTime
      return Math.min(el!.duration || Infinity, frameMedia + Math.min(1 / 30, (now - frameAt) / 1000))
    }

    function setDisc(x: number, y: number, sx: number, sy: number, angle: number) {
      disc.current!.style.transform =
        `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${sx}, ${sy}) rotate(${-angle}deg) translate(-50%, -50%)`
    }

    function setLight(k: number) {
      const b = lerp(VIDEO_LIGHT.brightness, 1, k)
      const s = lerp(VIDEO_LIGHT.saturate, 1, k)
      label.current!.style.filter = `brightness(${b}) saturate(${s})`
    }

    function finish() {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
      window.clearTimeout(skipTimer)
      window.clearTimeout(loadTimer)
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

    function frame(now: number) {
      if (!running) return
      const logo = document.getElementById('header-logo')
      const duration = el!.duration || 5
      const ended = endedAt > 0
      const t = ended ? duration : videoTime(now)
      const T = ended ? (now - endedAt) / 1000 : 0

      el!.style.objectPosition = `${objectX(t) * 100}% 50%`
      const { ox, oy, w, h } = toScreen(t)
      const lab = labelAt(t)
      const x0 = ox + lab.x * w
      const y0 = oy + lab.y * h
      const sx0 = (2 * lab.a * h * COVER) / (LABEL * BASE)
      const sy0 = (2 * lab.b * h * COVER) / (LABEL * BASE)

      // Drehung: 33 U/min im Video, in der Übergabe schneller und dann sanft bis zum aufrechten Logo
      const phi0 = RPM_DEG * duration
      let phi = RPM_DEG * t
      if (ended) {
        const A = 360 * Math.ceil((phi0 + EXTRA_SPIN) / 360) - phi0
        const m0 = (RPM_DEG * HANDOFF_END) / A
        const x = clamp01(T / HANDOFF_END)
        phi = phi0 + A * (m0 * (x * x * x - 2 * x * x + x) + (-2 * x * x * x + 3 * x * x))
      }
      spinner.current!.style.transform = `rotate(${phi}deg)`

      if (!ended || !logo) {
        setDisc(x0, y0, sx0, sy0, lab.angle)
        setLight(0)
      } else {
        // Übergabe: Label wird rund, Platte schrumpft zur Bildmitte und das Logo fliegt in die Kopfzeile
        const r = logo.getBoundingClientRect()
        const end = r.width / (LABEL * BASE)
        const mid = (Math.min(window.innerWidth, window.innerHeight) * 0.62) / BASE
        const round = (sx0 + sy0) / 2
        const shrink = easeInOutCubic(span(T, HANDOFF.shrink))
        const fly = easeInOutCubic(span(T, HANDOFF.fly))
        const x = lerp(lerp(x0, window.innerWidth / 2, shrink), r.left + r.width / 2, fly)
        const y = lerp(lerp(y0, window.innerHeight / 2, shrink), r.top + r.height / 2, fly)
        const s = lerp(lerp(round, Math.min(round, mid), shrink), end, fly)
        const toRound = shrink + (1 - shrink) * fly
        setDisc(x, y, lerp(sx0, s, toRound), lerp(sy0, s, toRound), lab.angle)
        setLight(span(T, HANDOFF.fly))
        vinyl.current!.style.opacity = String(span(T, HANDOFF.vinylIn) * (1 - span(T, HANDOFF.vinylOut)))
        stage.current!.style.opacity = String(1 - span(T, HANDOFF.stageOut))
        if (T >= HANDOFF_END) return finish()
      }
      raf = requestAnimationFrame(frame)
    }

    function onVideoFrame(now: number, meta: { mediaTime: number }) {
      frameMedia = meta.mediaTime
      frameAt = now
      if (running && !endedAt) el!.requestVideoFrameCallback(onVideoFrame)
    }

    function onEnded() {
      if (running && !endedAt) endedAt = performance.now()
    }

    function start() {
      if (!running) return
      window.clearTimeout(loadTimer)
      el!.removeEventListener('canplaythrough', start)
      // Blockiert der Browser das Abspielen, geht es ohne Intro direkt zur Seite
      el!.play().catch(finish)
      if ('requestVideoFrameCallback' in el!) el!.requestVideoFrameCallback(onVideoFrame)
    }

    function play() {
      if (running) return
      running = true
      endedAt = 0
      frameAt = 0
      // Das Logo landet in der Kopfzeile über dem Hero, daher immer vom Seitenanfang aus
      window.scrollTo(0, 0)
      root.classList.add('site-intro')
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      setSkipping(false)
      stage.current!.style.opacity = '1'
      vinyl.current!.style.opacity = '0'
      el!.currentTime = 0
      raf = requestAnimationFrame(frame)

      // Erst abspielen, wenn das Video vollständig geladen ist; bis dahin steht das erste Bild
      if (el!.readyState >= 4) start()
      else {
        el!.preload = 'auto'
        el!.addEventListener('canplaythrough', start)
        el!.load()
        loadTimer = window.setTimeout(start, LOAD_TIMEOUT)
      }

      // Erst nach dem auslösenden Klick zuhören, sonst würde der Button das Intro sofort überspringen
      setTimeout(() => {
        if (!running) return
        window.addEventListener('pointerdown', skip)
        window.addEventListener('keydown', skip)
      }, 0)
    }

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
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('error', finish)
      el.removeEventListener('canplaythrough', start)
      // Aufräumen stoppt nur; als gesehen gilt das Intro erst, wenn es gelaufen oder übersprungen ist
      if (running) {
        running = false
        cancelAnimationFrame(raf)
        window.clearTimeout(skipTimer)
        window.clearTimeout(loadTimer)
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

      {/* Echte Platte mit dem Logo als Label; im Video ist nur das Label sichtbar und liegt auf dem Video-Label */}
      <div ref={disc} className="intro-disc absolute left-0 top-0" style={{ width: BASE, height: BASE }}>
        <div ref={spinner} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={vinyl} src="/intro/vinyl.webp" alt="" className="absolute inset-0 h-full w-full" style={{ opacity: 0 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={label}
            src="/logo/dj-akki-friends.png"
            alt=""
            className="intro-label absolute rounded-full"
            style={{ inset: `${((1 - LABEL) / 2) * 100}%`, width: `${LABEL * 100}%`, height: `${LABEL * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
