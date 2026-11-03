'use client'

import { useEffect, useRef } from 'react'

// Platten, CDs, Kassetten und Noten fliegen von außen ein, verwirbeln und setzen sich zu Akkis Gesicht zusammen.
// Das Gesicht ist ein Raster aus Objekten: helle Bildpunkte werden größer, dunkle kleiner.

const SPRITES = ['/intro/vinyl.webp', '/intro/cd.webp', '/intro/note.webp', '/intro/tape.webp']
const FACE = '/intro/akki-face.webp'
const SEEN_KEY = 'djakki-intro-seen'

const VINYL = 0
const CD = 1
const NOTE = 2
const TAPE = 3

const DURATION = 4.2 // Flugzeit eines Objekts in Sekunden
const MAX_DELAY = 1.4 // Objekte starten gestaffelt
const SWIRL_END = 0.6 // Anteil der Flugzeit im Wirbel, danach geht es ins Raster

type Particle = {
  tx: number
  ty: number
  ts: number
  final: number
  swirl: number
  r0: number
  rv: number
  a0: number
  turns: number
  s0: number
  sv: number
  rot0: number
  spin: number
  delay: number
}

type Props = {
  // Platzhalter im Layout, dessen Fläche das Gesicht einnehmen soll
  targetRef: React.RefObject<HTMLElement>
  onDone?: () => void
  replayToken?: number
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Kleine Vorab-Kopie jedes Sprites, damit drawImage pro Frame weniger skalieren muss
function prerender(img: HTMLImageElement, size: number) {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  const k = Math.min(size / img.width, size / img.height)
  const w = img.width * k
  const h = img.height * k
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
  return c
}

function seenBefore() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    // ohne Speicher läuft das Intro eben jedes Mal
  }
}

export default function FaceVortex({ targetRef, onDone, replayToken = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const assets = useRef<{ face: HTMLImageElement; sprites: HTMLCanvasElement[] } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const target = targetRef.current
    if (!canvas || !target) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let cancelled = false
    let particles: Particle[] = []
    let start = 0
    let playing = false
    let width = 0
    let height = 0
    let dpr = 1

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animate = !reduced && (replayToken > 0 || !seenBefore())

    function build() {
      const { face } = assets.current!
      const host = canvas!.getBoundingClientRect()
      const box = target!.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = host.width
      height = host.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)

      const size = Math.min(box.width, box.height)
      const left = box.left - host.left + (box.width - size) / 2
      const top = box.top - host.top + (box.height - size) / 2
      const cols = Math.round(Math.min(72, Math.max(48, size / 7)))
      const cell = size / cols

      // Porträt auf das Raster herunterrechnen und Helligkeit je Zelle ablesen
      const sample = document.createElement('canvas')
      sample.width = cols
      sample.height = cols
      const sctx = sample.getContext('2d', { willReadFrequently: true })!
      sctx.drawImage(face, 0, 0, cols, cols)
      const data = sctx.getImageData(0, 0, cols, cols).data

      const cx = left + size / 2
      const cy = top + size / 2
      const far = Math.hypot(width, height) * 0.6
      const next: Particle[] = []

      // Helligkeit je Zelle; der schwarze Hintergrund fällt weg
      const cells: { x: number; y: number; raw: number }[] = []
      for (let y = 0; y < cols; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4
          const raw = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
          if (raw > 0.09) cells.push({ x, y, raw })
        }
      }

      // Histogramm-Ausgleich: jede Helligkeitsstufe kommt gleich oft vor, so bleiben Augen, Nase und Mund lesbar
      const ranked = cells.map((c) => c.raw).sort((a, b) => a - b)
      const rank = (v: number) => {
        let lo = 0
        let hi = ranked.length
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          if (ranked[mid] < v) lo = mid + 1
          else hi = mid
        }
        return lo / Math.max(1, ranked.length - 1)
      }

      for (const { x, y, raw } of cells) {
        const l = 0.5 * rank(raw) + 0.5 * clamp01((raw - 0.09) / 0.8)

        // Helle Partien als CD, mittlere als Note, dunkle als Platte – wie Graustufen eines Rasterdrucks
        const final = l > 0.66 ? CD : l > 0.36 ? NOTE : VINYL
        const rnd = Math.random()
        next.push({
          tx: left + (x + 0.5) * cell,
          ty: top + (y + 0.5) * cell,
          ts: cell * (0.3 + 0.85 * l * l),
          final,
          swirl: rnd < 0.22 ? TAPE : rnd < 0.45 ? VINYL : rnd < 0.7 ? CD : NOTE,
          r0: far * (1.05 + Math.random() * 0.5),
          rv: size * (0.04 + Math.random() * 0.3),
          a0: Math.random() * Math.PI * 2,
          turns: (1.6 + Math.random() * 1.6) * Math.PI * 2,
          s0: 26 + 110 * Math.pow(Math.random(), 3),
          sv: 6 + Math.random() * 10,
          rot0: Math.random() * Math.PI * 2,
          spin: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 6),
          delay: Math.random() * MAX_DELAY,
        })
      }

      // Große Objekte zuletzt zeichnen, damit sie über den kleinen schweben
      next.sort((a, b) => a.s0 - b.s0)
      particles = next
      vortexCenter = { x: cx, y: cy }
    }

    let vortexCenter = { x: 0, y: 0 }

    function drawSprite(sprite: HTMLCanvasElement, x: number, y: number, s: number, rot: number, alpha: number) {
      if (alpha <= 0.01 || s < 0.5) return
      const cos = Math.cos(rot) * dpr
      const sin = Math.sin(rot) * dpr
      ctx!.globalAlpha = alpha
      ctx!.setTransform(cos, sin, -sin, cos, x * dpr, y * dpr)
      ctx!.drawImage(sprite, -s / 2, -s / 2, s, s)
    }

    function drawFinal() {
      const { sprites } = assets.current!
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (const p of particles) drawSprite(sprites[p.final], p.tx, p.ty, p.ts, 0, 1)
      ctx!.globalAlpha = 1
    }

    function frame(now: number) {
      if (cancelled) return
      if (!start) start = now
      const t = (now - start) / 1000
      const { sprites } = assets.current!
      const { x: cx, y: cy } = vortexCenter

      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (const p of particles) {
        const u = clamp01((t - p.delay) / DURATION)
        const angle = p.a0 + p.turns * easeOutCubic(u)

        if (u < SWIRL_END) {
          // Phase 1: von außen in den Wirbel, dabei immer kleiner
          const v = u / SWIRL_END
          const e = easeOutCubic(v)
          const r = lerp(p.r0, p.rv, e)
          const s = lerp(p.s0, p.sv, e)
          drawSprite(sprites[p.swirl], cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, s, p.rot0 + p.spin * u, 1)
        } else {
          // Phase 2: aus dem Wirbel an den eigenen Bildpunkt, das Objekt wird zum Pixel des Gesichts
          const v = (u - SWIRL_END) / (1 - SWIRL_END)
          const e = easeInOutCubic(v)
          const r = p.rv * (1 - 0.4 * v)
          const x = lerp(cx + Math.cos(angle) * r, p.tx, e)
          const y = lerp(cy + Math.sin(angle) * r, p.ty, e)
          const s = lerp(p.sv, p.ts, e)
          const rot = lerp(p.rot0 + p.spin * u, 0, e)
          if (p.swirl === p.final) {
            drawSprite(sprites[p.final], x, y, s, rot, 1)
          } else {
            drawSprite(sprites[p.swirl], x, y, s, rot, 1 - e)
            drawSprite(sprites[p.final], x, y, s, rot, e)
          }
        }
      }
      ctx!.globalAlpha = 1

      if (t < MAX_DELAY + DURATION) {
        raf = requestAnimationFrame(frame)
      } else {
        playing = false
        drawFinal()
        markSeen()
        onDone?.()
      }
    }

    async function init() {
      if (!assets.current) {
        const [face, ...imgs] = await Promise.all([loadImage(FACE), ...SPRITES.map(loadImage)])
        assets.current = { face, sprites: imgs.map((img) => prerender(img, 128)) }
      }
      if (cancelled) return
      build()
      if (animate) {
        playing = true
        start = 0
        raf = requestAnimationFrame(frame)
      } else {
        drawFinal()
        onDone?.()
      }
    }

    init().catch(() => onDone?.())

    // Bei Größenänderung das Raster neu berechnen; ein laufendes Intro fliegt einfach in die neuen Ziele
    let resizeFrame = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(() => {
        if (!assets.current) return
        build()
        if (!playing) drawFinal()
      })
    })
    ro.observe(canvas)
    ro.observe(target)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizeFrame)
      ro.disconnect()
    }
  }, [targetRef, onDone, replayToken])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}
