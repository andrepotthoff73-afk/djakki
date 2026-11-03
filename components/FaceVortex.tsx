'use client'

import { useEffect, useRef } from 'react'

// Ein paar große Platten, CDs, Kassetten und Noten liegen am Boden. Ein Wirbelsturm reißt sie hoch,
// zieht immer mehr Objekte von außerhalb des Bildes herein und setzt alles zu Akkis Gesicht zusammen.
// Danach verfeinert sich das Raster und verwandelt sich in das echte Foto.

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

const CALM = 1.1 // so lange liegen die Objekte still am Boden
const GROUND_PICKUP = 0.9 // in dieser Zeit erfasst der Sturm alle Bodenobjekte
const STREAM_START = CALM + 0.6 // ab hier zieht der Sturm Nachschub von außen herein
const STREAM_SPAN = 2.2 // über diese Zeit verteilt kommt der Nachschub
const GROUND_FLIGHT = 3.2
const STREAM_FLIGHT = 2.6
const STORM_END = 0.8 // Anteil der Flugzeit im Sturm, danach geht es an den Bildpunkt
const GRID_DONE = STREAM_START + STREAM_SPAN + STREAM_FLIGHT
const MORPH_START = GRID_DONE + 0.4
const MORPH = 2.4 // Verfeinern und Verwandeln ins Foto
const TOTAL = MORPH_START + MORPH
const FLAT = 0.78 // am Boden liegende Objekte sind perspektivisch leicht gestaucht

type Sprite = { big: HTMLCanvasElement; small: HTMLCanvasElement }

type Particle = {
  tx: number
  ty: number
  ts: number
  ta: number
  final: number
  kind: number
  onGround: boolean
  gx: number
  gy: number
  h0: number
  s0: number
  rg: number
  ag: number
  hp: number
  turns: number
  rot0: number
  spin: number
  pickup: number
  flight: number
}

type Cell = { x: number; y: number; l: number }

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

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.round(w))
  c.height = Math.max(1, Math.round(h))
  return c
}

// Vorab verkleinerte Kopien, damit drawImage pro Frame wenig skalieren muss
// Verkleinert wird in Halbierungsschritten, sonst flimmern die feinen Rillen der Platten zu Sternmustern
function prerender(img: HTMLImageElement, size: number, rim = false) {
  let src: CanvasImageSource = img
  let sw = img.width
  let sh = img.height
  const k = Math.min(size / sw, size / sh)
  const targetW = img.width * k
  while (targetW * 2 < sw) {
    const step = makeCanvas(sw / 2, sh / 2)
    const sctx = step.getContext('2d')!
    sctx.imageSmoothingQuality = 'high'
    sctx.drawImage(src, 0, 0, step.width, step.height)
    src = step
    sw = step.width
    sh = step.height
  }
  const c = makeCanvas(size, size)
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  const w = img.width * k
  const h = img.height * k
  ctx.drawImage(src, (size - w) / 2, (size - h) / 2, w, h)
  // Schwarze Platten verschwinden sonst auf der dunklen Bühne: eine feine Lichtkante zeichnet den Rand nach
  if (rim) {
    ctx.strokeStyle = 'rgba(236, 235, 230, 0.35)'
    ctx.lineWidth = Math.max(1, size * 0.025)
    ctx.beginPath()
    ctx.ellipse(size / 2, size / 2, w / 2 - ctx.lineWidth / 2, h / 2 - ctx.lineWidth / 2, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  return c
}

// Porträt-Ausschnitt, dessen Schwarz auf die Farbe der Bühne angehoben wird, damit keine Kante entsteht
function preparePhoto(face: HTMLImageElement) {
  const cs = Math.round(face.width * CROP.size)
  const c = makeCanvas(cs, cs)
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(face, face.width * CROP.x, face.height * CROP.y, cs, cs, 0, 0, cs, cs)
  const hex = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#111214'
  const n = parseInt(hex.replace('#', ''), 16)
  const ink = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  const img = ctx.getImageData(0, 0, cs, cs)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.max(d[i], ink[0])
    d[i + 1] = Math.max(d[i + 1], ink[1])
    d[i + 2] = Math.max(d[i + 2], ink[2])
  }
  ctx.putImageData(img, 0, 0)
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

// Porträt auf ein Raster mit cols Spalten herunterrechnen: geschärft und mit teilweisem Histogramm-Ausgleich
function sampleGrid(photo: HTMLCanvasElement, cols: number): Cell[] {
  const sample = makeCanvas(cols, cols)
  const sctx = sample.getContext('2d', { willReadFrequently: true })!
  sctx.imageSmoothingQuality = 'high'
  sctx.drawImage(photo, 0, 0, cols, cols)
  const data = sctx.getImageData(0, 0, cols, cols).data
  const lum = new Float32Array(cols * cols)
  for (let i = 0; i < lum.length; i++) {
    lum[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
  }

  // Unscharfe Maske: Augen, Brauen, Nase und Mund treten deutlicher hervor
  const soft = blur(lum, cols)
  const raw: { x: number; y: number; v: number }[] = []
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x
      if (lum[i] > 0.1) raw.push({ x, y, v: lum[i] + 1.1 * (lum[i] - soft[i]) })
    }
  }

  const ranked = raw.map((c) => c.v).sort((a, b) => a - b)
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

  return raw.map(({ x, y, v }) => ({ x, y, l: clamp01(0.6 * rank(v) + 0.4 * clamp01((v - 0.1) / 0.85)) }))
}

const kindFor = (l: number) => (l < 0.22 ? VINYL : l < 0.45 ? NOTE : l < 0.68 ? CD : TAPE)

export default function FaceVortex({ targetRef, onDone, replayToken = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const assets = useRef<{ photo: HTMLCanvasElement; sprites: Sprite[] } | null>(null)

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
    // Fertige Raster als Bilder: grob (Ziel der Objekte) und fein (Zwischenstufe zum Foto)
    let coarse: HTMLCanvasElement | null = null
    let fine: HTMLCanvasElement | null = null
    let fineCell = 4
    let face = { left: 0, top: 0, size: 0 }
    // Geometrie des Sturms: Achse über dem Gesicht, Fuß am unteren Rand der Bühne
    let storm = { cx: 0, ground: 0, height: 0, rBase: 0, rTop: 0, size: 0 }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animate = !reduced && (replayToken > 0 || !seenBefore())

    function drawSpriteOn(
      c: CanvasRenderingContext2D,
      sprite: Sprite,
      x: number,
      y: number,
      s: number,
      rot: number,
      alpha: number,
      squash = 1,
    ) {
      if (alpha <= 0.01 || s < 0.6) return
      const cos = Math.cos(rot) * dpr
      const sin = Math.sin(rot) * dpr
      c.globalAlpha = alpha
      c.setTransform(cos, sin * squash, -sin, cos * squash, x * dpr, y * dpr)
      // Große Objekte werfen einen weichen Schatten, das lässt sie real und greifbar wirken
      if (s > 34) {
        c.shadowColor = 'rgba(0, 0, 0, 0.55)'
        c.shadowBlur = s * 0.18 * dpr
        c.shadowOffsetY = s * 0.08 * dpr
      }
      c.drawImage(s * dpr > 40 ? sprite.big : sprite.small, -s / 2, -s / 2, s, s)
      if (s > 34) {
        c.shadowColor = 'transparent'
        c.shadowBlur = 0
        c.shadowOffsetY = 0
      }
    }

    function renderGrid(cells: Cell[], cell: number) {
      const { sprites } = assets.current!
      const out = makeCanvas(canvas!.width, canvas!.height)
      const octx = out.getContext('2d')!
      for (const { x, y, l } of cells) {
        drawSpriteOn(
          octx,
          sprites[kindFor(l)],
          face.left + (x + 0.5) * cell,
          face.top + (y + 0.5) * cell,
          cell * (0.45 + 0.8 * l),
          0,
          0.5 + 0.5 * l,
        )
      }
      return out
    }

    function build() {
      const { photo } = assets.current!
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
      face = { left, top, size }

      const cols = Math.round(Math.min(96, Math.max(64, size / 6.5)))
      const cell = size / cols
      const cells = sampleGrid(photo, cols)
      const fineCols = Math.round(cols * 1.8)
      fineCell = size / fineCols
      coarse = renderGrid(cells, cell)
      fine = renderGrid(sampleGrid(photo, fineCols), fineCell)

      // Boden an der Unterkante des sichtbaren Bildschirms, auch wenn der Hero auf dem Handy höher ist
      const visible = Math.min(height, window.innerHeight - host.top)
      const ground = visible - Math.max(16, visible * 0.04)
      const cx = left + size / 2
      const scale = Math.max(0.6, Math.min(1, Math.min(width, height) / 800))
      storm = { cx, ground, height: ground - top, rBase: size * 0.03, rTop: size * 0.42, size }

      // Nur wenige, große Objekte liegen sichtbar am Boden, alle anderen kommen von außerhalb
      const groundCount = width < 640 ? 14 : 26
      const groundSet = new Set<number>()
      while (groundSet.size < Math.min(groundCount, cells.length)) groundSet.add(Math.floor(Math.random() * cells.length))
      const band = height * 0.16
      const sideReach = Math.max(cx, width - cx)

      const next: Particle[] = []
      let groundSlot = 0
      cells.forEach(({ x, y, l }, index) => {
        const tx = left + (x + 0.5) * cell
        const ty = top + (y + 0.5) * cell
        const onGround = groundSet.has(index)
        const base = {
          tx,
          ty,
          ts: cell * (0.45 + 0.8 * l),
          ta: 0.5 + 0.5 * l,
          final: kindFor(l),
          hp: (ground - ty) * (0.85 + Math.random() * 0.3),
          turns: (1.6 + Math.random() * 1.4) * Math.PI * 2,
          rot0: Math.random() * Math.PI * 2,
          spin: (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 5),
        }

        if (onGround) {
          // Großes Objekt flach auf dem Boden, gleichmäßig über die Breite verteilt
          const slot = groundSlot++
          const depth = Math.random()
          const gx = ((slot + 0.5 + (Math.random() - 0.5) * 0.6) / groundCount) * width
          const gy = ground - band * (1 - depth)
          const dx = gx - cx
          const dy = (gy - ground) / 0.28
          next.push({
            ...base,
            kind: slot % 4,
            onGround: true,
            gx,
            gy,
            h0: 0,
            s0: (70 + 50 * Math.random()) * (0.75 + 0.25 * depth) * scale,
            rg: Math.hypot(dx, dy),
            ag: Math.atan2(dy, dx),
            pickup: CALM + (Math.abs(dx) / sideReach) * GROUND_PICKUP + Math.random() * 0.15,
            flight: GROUND_FLIGHT,
          })
          return
        }

        // Nachschub: startet links oder rechts außerhalb des Bildes in unterschiedlicher Höhe
        const fromLeft = Math.random() < 0.5
        const ag = (fromLeft ? Math.PI : 0) + (Math.random() - 0.5) * 0.5
        const rg = (sideReach + 80 + Math.random() * 120) / Math.max(0.5, Math.abs(Math.cos(ag)))
        next.push({
          ...base,
          kind: Math.floor(Math.random() * 4),
          onGround: false,
          gx: 0,
          gy: 0,
          h0: Math.random() * storm.height * 0.7,
          s0: (16 + 18 * Math.random()) * Math.max(0.7, scale),
          rg,
          ag,
          pickup: STREAM_START + Math.pow(Math.random(), 0.8) * STREAM_SPAN,
          flight: STREAM_FLIGHT,
        })
      })

      particles = next
    }

    const airSize = (p: Particle) => Math.max(p.ts * 2.2, 12)

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

    // Position eines Objekts im Sturm bei Fortschritt w (0 = Start, 1 = Absprung zum Bildpunkt)
    function inStorm(p: Particle, w: number, t: number) {
      const angle = p.ag + p.turns * Math.pow(w, 1.3)
      const lift = smoothstep(clamp01((w - 0.2) / 0.8))
      const h = lerp(p.h0, p.hp, lift)
      // Erst in den Trichter gezogen (über den Boden oder von der Seite), dann auf dessen Bahn nach oben
      const r = w < 0.2 ? lerp(p.rg, funnel(h), easeInOutCubic(w / 0.2)) : funnel(h)
      return {
        x: axis(h, t) + Math.cos(angle) * r,
        y: storm.ground - h + Math.sin(angle) * r * 0.28,
        near: Math.sin(angle),
        h,
      }
    }

    function drawFlight(t: number) {
      const { sprites } = assets.current!
      for (const p of particles) {
        const u = (t - p.pickup) / p.flight

        if (u <= 0) {
          if (!p.onGround) continue
          // Liegt noch flach am Boden, kurz vor dem Erfassen zittert es im Wind
          const shake = clamp01(1 + u * 6) * 3
          drawSpriteOn(ctx!, sprites[p.kind], p.gx + Math.sin(t * 40 + p.rot0) * shake, p.gy, p.s0, p.rot0, 1, FLAT)
          continue
        }

        if (u < STORM_END) {
          const w = u / STORM_END
          const pos = inStorm(p, w, t)
          const depth = 0.8 + 0.2 * pos.near
          // Im Trichter bleiben die Objekte lange groß genug, um sie als Platte, CD, Kassette oder Note zu erkennen
          const s = lerp(p.s0, airSize(p), w * w) * depth
          const squash = p.onGround ? lerp(FLAT, 1, clamp01(pos.h / 30)) : 1
          drawSpriteOn(ctx!, sprites[p.kind], pos.x, pos.y, s, p.rot0 + p.spin * w, 0.55 + 0.45 * depth, squash)
          continue
        }

        // Aus dem Sturm an den eigenen Bildpunkt, dabei wird das Objekt zum Pixel des Gesichts
        const v = Math.min(1, (u - STORM_END) / (1 - STORM_END))
        const e = easeInOutCubic(v)
        const pos = inStorm(p, 1, t)
        const depth = 0.8 + 0.2 * pos.near
        const x = lerp(pos.x, p.tx, e)
        const y = lerp(pos.y, p.ty, e)
        const s = lerp(airSize(p) * depth, p.ts, e)
        const rot = lerp(p.rot0 + p.spin, 0, e)
        const alpha = lerp(0.55 + 0.45 * depth, p.ta, e)
        if (p.kind === p.final) {
          drawSpriteOn(ctx!, sprites[p.final], x, y, s, rot, alpha)
        } else {
          drawSpriteOn(ctx!, sprites[p.kind], x, y, s, rot, alpha * (1 - e))
          drawSpriteOn(ctx!, sprites[p.final], x, y, s, rot, alpha * e)
        }
      }
    }

    // Foto mit Blockgröße block (in CSS-Pixeln) zeichnen; 0 = scharf
    const pixelBuffer = makeCanvas(1, 1)
    function drawPhoto(block: number, alpha: number) {
      if (alpha <= 0.01) return
      const { photo } = assets.current!
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.globalAlpha = alpha
      if (block <= 1.2) {
        ctx!.imageSmoothingEnabled = true
        ctx!.drawImage(photo, face.left, face.top, face.size, face.size)
        return
      }
      const n = Math.max(2, Math.round(face.size / block))
      pixelBuffer.width = n
      pixelBuffer.height = n
      const pctx = pixelBuffer.getContext('2d')!
      pctx.imageSmoothingQuality = 'high'
      pctx.drawImage(photo, 0, 0, n, n)
      ctx!.imageSmoothingEnabled = false
      ctx!.drawImage(pixelBuffer, face.left, face.top, face.size, face.size)
      ctx!.imageSmoothingEnabled = true
    }

    function drawLayer(layer: HTMLCanvasElement | null, alpha: number) {
      if (!layer || alpha <= 0.01) return
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.globalAlpha = alpha
      ctx!.drawImage(layer, 0, 0)
    }

    // Morph am Ende: grobes Raster → feines Raster → verpixeltes Foto → scharfes Foto
    function drawMorph(m: number) {
      const refine = smoothstep(clamp01(m / 0.3))
      const toPhoto = smoothstep(clamp01((m - 0.25) / 0.3))
      const sharpen = easeInOutCubic(clamp01((m - 0.3) / 0.7))
      drawLayer(coarse, (1 - refine) * (1 - toPhoto))
      drawLayer(fine, refine * (1 - toPhoto))
      drawPhoto(lerp(fineCell, 1, sharpen), toPhoto)
      ctx!.globalAlpha = 1
    }

    function drawFinal() {
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      drawPhoto(0, 1)
      ctx!.globalAlpha = 1
    }

    function frame(now: number) {
      if (cancelled) return
      if (!start) start = now
      const t = (now - start) / 1000

      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Sturm baut sich nach der Ruhe auf und legt sich, wenn das Gesicht steht
      const strength = clamp01((t - CALM * 0.6) / 0.8) * clamp01((GRID_DONE - t) / 1.2)
      drawStorm(t, strength)

      if (t < MORPH_START) drawFlight(t)
      else drawMorph((t - MORPH_START) / MORPH)
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
        assets.current = {
          photo: preparePhoto(face),
          sprites: imgs.map((img, i) => ({ big: prerender(img, 256, i === VINYL), small: prerender(img, 48, i === VINYL) })),
        }
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

    // Bei Größenänderung alles neu berechnen; ein laufendes Intro fliegt in die neuen Ziele
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
