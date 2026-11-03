'use client'

import { useEffect, useRef } from 'react'

// Platten, CDs, Kassetten und Noten liegen am Boden, ein Wirbelsturm reißt sie hoch und setzt sie zu Akkis Gesicht zusammen.
// Das Gesicht ist ein dichtes Raster aus diesen Objekten: Art, Größe und Deckkraft folgen der Helligkeit des Porträts.

const SPRITES = ['/intro/vinyl.webp', '/intro/note.webp', '/intro/tape.webp', '/intro/cd.webp']
const FACE = '/intro/akki-face.webp'
const SEEN_KEY = 'djakki-intro-seen'

// Reihenfolge von dunkel nach hell, so wie die Objekte auf dunklem Grund wirken
const VINYL = 0
const NOTE = 1
const TAPE = 2
const CD = 3

// Ausschnitt des Porträts (Anteile der Bildbreite): Kopf und Hals, ohne viel Schulter
const CROP = { x: 0.11, y: 0, size: 0.78 }

const CALM = 0.9 // so lange liegt alles still am Boden
const MAX_PICKUP = 1.7 // die Objekte am Rand werden zuletzt erfasst
const DURATION = 3.6 // Flugzeit eines Objekts vom Boden bis in sein Raster-Feld
const STORM_END = 0.8 // Anteil der Flugzeit im Sturm, danach geht es an den Bildpunkt
const TOTAL = CALM + MAX_PICKUP + 0.3 + DURATION
const FLAT = 0.62 // am Boden liegende Objekte sind perspektivisch gestaucht

type Sprite = { big: HTMLCanvasElement; small: HTMLCanvasElement }

type Particle = {
  tx: number
  ty: number
  ts: number
  ta: number
  final: number
  kind: number
  gx: number
  gy: number
  s0: number
  rg: number
  ag: number
  hp: number
  turns: number
  rot0: number
  spin: number
  pickup: number
}

type Props = {
  // Platzhalter im Layout, dessen Fläche das Gesicht einnehmen soll
  targetRef: React.RefObject<HTMLElement>
  onDone?: () => void
  replayToken?: number
}

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const smoothstep = (x: number) => x * x * (3 - 2 * x)
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

// Vorab verkleinerte Kopien, damit drawImage pro Frame wenig skalieren muss
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

// Kastenunschärfe auf einem Graustufen-Raster, Grundlage für die Schärfung
function blur(src: Float32Array, n: number) {
  const out = new Float32Array(src.length)
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let sum = 0
      let count = 0
      for (let dy = -2; dy <= 2; dy++) {
        const yy = y + dy
        if (yy < 0 || yy >= n) continue
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx
          if (xx < 0 || xx >= n) continue
          sum += src[yy * n + xx]
          count++
        }
      }
      out[y * n + x] = sum / count
    }
  }
  return out
}

export default function FaceVortex({ targetRef, onDone, replayToken = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const assets = useRef<{ face: HTMLImageElement; sprites: Sprite[] } | null>(null)

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
    let dpr = 1
    // Geometrie des Sturms: Achse über dem Gesicht, Fuß am unteren Rand der Bühne
    let storm = { cx: 0, ground: 0, height: 0, rBase: 0, rTop: 0, size: 0 }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animate = !reduced && (replayToken > 0 || !seenBefore())

    function build() {
      const { face } = assets.current!
      const host = canvas!.getBoundingClientRect()
      const box = target!.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = host.width
      const height = host.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)

      const size = Math.min(box.width, box.height)
      const left = box.left - host.left + (box.width - size) / 2
      const top = box.top - host.top + (box.height - size) / 2
      const cols = Math.round(Math.min(96, Math.max(64, size / 6.5)))
      const cell = size / cols

      // Porträt-Ausschnitt auf das Raster herunterrechnen
      const sample = document.createElement('canvas')
      sample.width = cols
      sample.height = cols
      const sctx = sample.getContext('2d', { willReadFrequently: true })!
      sctx.imageSmoothingQuality = 'high'
      const cs = face.width * CROP.size
      sctx.drawImage(face, face.width * CROP.x, face.height * CROP.y, cs, cs, 0, 0, cols, cols)
      const data = sctx.getImageData(0, 0, cols, cols).data
      const lum = new Float32Array(cols * cols)
      for (let i = 0; i < lum.length; i++) {
        lum[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
      }

      // Unscharfe Maske: Augen, Brauen, Nase und Mund treten deutlicher hervor
      const soft = blur(lum, cols)
      const sharp = lum.map((v, i) => v + 1.1 * (v - soft[i]))

      const cells: { x: number; y: number; v: number }[] = []
      for (let y = 0; y < cols; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          if (lum[i] > 0.08) cells.push({ x, y, v: sharp[i] })
        }
      }

      // Teilweiser Histogramm-Ausgleich, damit alle Helligkeitsstufen genutzt werden
      const ranked = cells.map((c) => c.v).sort((a, b) => a - b)
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

      const ground = height - Math.max(16, height * 0.03)
      const band = height * 0.26
      const cx = left + size / 2
      storm = {
        cx,
        ground,
        height: ground - top,
        rBase: size * 0.03,
        rTop: size * 0.42,
        size,
      }

      const next: Particle[] = []
      for (const { x, y, v } of cells) {
        const l = clamp01(0.6 * rank(v) + 0.4 * clamp01((v - 0.08) / 0.85))
        const final = l < 0.22 ? VINYL : l < 0.47 ? NOTE : l < 0.7 ? TAPE : CD
        const tx = left + (x + 0.5) * cell
        const ty = top + (y + 0.5) * cell

        // Liegeplatz am Boden: hinten kleiner, vorne größer, wie auf einer Fläche
        const depth = Math.random()
        const gx = Math.random() * width
        const gy = ground - band * (1 - depth)
        const dx = gx - cx
        const dy = (gy - ground) / 0.28
        const reach = Math.abs(dx) / Math.max(cx, width - cx)

        next.push({
          tx,
          ty,
          ts: cell * (0.45 + 0.8 * l),
          ta: 0.5 + 0.5 * l,
          final,
          // Am Boden und im Sturm gleich verteilt; die Art steht erst am Ziel fest
          kind: Math.floor(Math.random() * 4),
          gx,
          gy,
          s0: (22 + 38 * Math.pow(Math.random(), 1.8)) * (0.5 + 0.5 * depth),
          rg: Math.hypot(dx, dy),
          ag: Math.atan2(dy, dx),
          hp: (ground - ty) * (0.85 + Math.random() * 0.3),
          turns: (2 + Math.random() * 1.5) * Math.PI * 2,
          rot0: Math.random() * Math.PI * 2,
          spin: (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 6),
          pickup: CALM + reach * MAX_PICKUP + Math.random() * 0.3,
        })
      }

      // Hinten liegende Objekte zuerst zeichnen
      next.sort((a, b) => a.gy - b.gy)
      particles = next
    }

    function drawSprite(sprite: Sprite, x: number, y: number, s: number, rot: number, alpha: number, squash = 1) {
      if (alpha <= 0.01 || s < 0.6) return
      const cos = Math.cos(rot) * dpr
      const sin = Math.sin(rot) * dpr
      ctx!.globalAlpha = alpha
      ctx!.setTransform(cos, sin * squash, -sin, cos * squash, x * dpr, y * dpr)
      ctx!.drawImage(s * dpr > 40 ? sprite.big : sprite.small, -s / 2, -s / 2, s, s)
    }

    function drawFinal() {
      const { sprites } = assets.current!
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (const p of particles) drawSprite(sprites[p.final], p.tx, p.ty, p.ts, 0, p.ta)
      ctx!.globalAlpha = 1
    }

    const airSize = (p: Particle) => Math.max(p.ts * 2.2, 13)

    // Radius des Trichters: unten eng, oben weit
    const funnel = (h: number) => storm.rBase + (storm.rTop - storm.rBase) * Math.pow(clamp01(h / storm.height), 1.4)

    // Die Achse schwankt leicht, oben stärker als unten
    const axis = (h: number, t: number) =>
      storm.cx + Math.sin(t * 1.4 + h * 0.008) * storm.size * 0.07 * clamp01(h / storm.height)

    // Durchscheinende Windbänder geben dem Sturm seine Trichterform
    function drawStorm(t: number, strength: number) {
      if (strength <= 0.01) return
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.globalAlpha = 1
      ctx!.lineCap = 'round'
      const bands = 70
      for (let i = 0; i < bands; i++) {
        const k = i / bands
        const h = storm.height * k * strength
        const r = funnel(h) * 1.15
        const y = storm.ground - h
        const a0 = -t * (7 - 3 * k) + i * 0.9
        ctx!.strokeStyle = `rgba(236, 235, 230, ${0.05 + 0.06 * (1 - k)})`
        ctx!.lineWidth = 1 + 2.5 * (1 - k)
        ctx!.beginPath()
        ctx!.ellipse(axis(h, t), y, r, r * 0.28, 0, a0, a0 + 1.4 + k)
        ctx!.stroke()
      }
      // Flache Staubwolke am Fuß, als gestauchter Kreis ohne harte Kanten
      const r = storm.size * 0.5
      ctx!.setTransform(dpr, 0, 0, dpr * 0.3, storm.cx * dpr, storm.ground * dpr)
      const dust = ctx!.createRadialGradient(0, 0, 0, 0, 0, r)
      dust.addColorStop(0, `rgba(236, 235, 230, ${0.14 * strength})`)
      dust.addColorStop(1, 'rgba(236, 235, 230, 0)')
      ctx!.fillStyle = dust
      ctx!.beginPath()
      ctx!.arc(0, 0, r, 0, Math.PI * 2)
      ctx!.fill()
    }

    // Position eines Objekts im Sturm bei Fortschritt w (0 = am Boden, 1 = Absprung zum Bildpunkt)
    function inStorm(p: Particle, w: number, t: number) {
      const angle = p.ag + p.turns * Math.pow(w, 1.3)
      const lift = smoothstep(clamp01((w - 0.2) / 0.8))
      const h = p.hp * lift
      // Erst über den Boden in den Fuß des Trichters gezogen, dann auf dessen Bahn nach oben
      const r = w < 0.2 ? lerp(p.rg, funnel(0), easeInOutCubic(w / 0.2)) : funnel(h)
      return {
        x: axis(h, t) + Math.cos(angle) * r,
        y: storm.ground - h + Math.sin(angle) * r * 0.28,
        near: Math.sin(angle),
        h,
      }
    }

    function frame(now: number) {
      if (cancelled) return
      if (!start) start = now
      const t = (now - start) / 1000
      const { sprites } = assets.current!

      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Sturm baut sich nach der Ruhe auf und legt sich, wenn das Gesicht steht
      const strength = clamp01((t - CALM * 0.6) / 0.8) * clamp01((TOTAL - 0.4 - t) / 1.2)
      drawStorm(t, strength)

      for (const p of particles) {
        const u = (t - p.pickup) / DURATION

        if (u <= 0) {
          // Liegt noch flach am Boden, kurz vor dem Erfassen zittert es im Wind
          const shake = clamp01(1 + u * 6) * 2
          drawSprite(sprites[p.kind], p.gx + Math.sin(t * 40 + p.rot0) * shake, p.gy, p.s0, p.rot0, 1, FLAT)
          continue
        }

        if (u < STORM_END) {
          const w = u / STORM_END
          const pos = inStorm(p, w, t)
          const depth = 0.8 + 0.2 * pos.near
          // Im Trichter bleiben die Objekte lange groß genug, um sie als Platte, CD, Kassette oder Note zu erkennen
          const s = lerp(p.s0, airSize(p), w * w) * depth
          const squash = lerp(FLAT, 1, clamp01(pos.h / 30))
          drawSprite(sprites[p.kind], pos.x, pos.y, s, p.rot0 + p.spin * w, 0.55 + 0.45 * depth, squash)
          continue
        }

        // Aus dem Sturm an den eigenen Bildpunkt, dabei wird das Objekt zum Pixel des Gesichts
        const v = Math.min(1, (u - STORM_END) / (1 - STORM_END))
        const e = easeInOutCubic(v)
        const pos = inStorm(p, 1, t)
        const x = lerp(pos.x, p.tx, e)
        const y = lerp(pos.y, p.ty, e)
        const s = lerp(airSize(p) * (0.8 + 0.2 * pos.near), p.ts, e)
        const rot = lerp(p.rot0 + p.spin, 0, e)
        const alpha = lerp(0.55 + 0.45 * (0.8 + 0.2 * pos.near), p.ta, e)
        if (p.kind === p.final) {
          drawSprite(sprites[p.final], x, y, s, rot, alpha)
        } else {
          drawSprite(sprites[p.kind], x, y, s, rot, alpha * (1 - e))
          drawSprite(sprites[p.final], x, y, s, rot, alpha * e)
        }
      }
      ctx!.globalAlpha = 1

      if (t < TOTAL) {
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
        assets.current = { face, sprites: imgs.map((img) => ({ big: prerender(img, 128), small: prerender(img, 40) })) }
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

    // Bei Größenänderung das Raster neu berechnen; ein laufendes Intro fliegt in die neuen Ziele
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
