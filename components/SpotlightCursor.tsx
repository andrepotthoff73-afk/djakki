'use client'

import { useEffect, useRef } from 'react'

type Props = {
  radius?: number
  brightness?: number
  color?: string
  // Anteil pro Bild, mit dem der Lichtkreis der Maus folgt: kleiner = träger
  smoothing?: number
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

// Weiches Licht unter dem Cursor. Liegt über allem, reagiert nicht auf Klicks.
export default function SpotlightCursor({
  radius = 220,
  brightness = 0.15,
  color = '#ffffff',
  smoothing = 0.14,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Auf Touchgeräten gibt es keinen Cursor, dort bleibt der Effekt aus
    if (window.matchMedia('(pointer: coarse)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let frame = 0
    let target = { x: -1000, y: -1000 }
    let current = { x: -1000, y: -1000 }
    let visible = false
    const rgb = hexToRgb(color)

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onMove = (e: MouseEvent) => {
      target = { x: e.clientX, y: e.clientY }
      if (!visible) {
        // Beim ersten Bewegen direkt dort starten, nicht von der Ecke aus gleiten
        current = { ...target }
        visible = true
      }
    }

    // Verlässt der Cursor das Fenster, verschwindet das Licht
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) visible = false
    }

    const draw = () => {
      current = {
        x: current.x + (target.x - current.x) * smoothing,
        y: current.y + (target.y - current.y) * smoothing,
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (visible) {
        const g = ctx.createRadialGradient(current.x, current.y, 0, current.x, current.y, radius)
        g.addColorStop(0, `rgba(${rgb},${brightness})`)
        g.addColorStop(1, `rgba(${rgb},0)`)
        ctx.fillStyle = g
        ctx.fillRect(current.x - radius, current.y - radius, radius * 2, radius * 2)
      }
      frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseout', onOut)
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseout', onOut)
    }
  }, [radius, brightness, color, smoothing])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[9999] h-full w-full" />
}
