'use client'

import { useCallback, useRef, useState } from 'react'
import FaceVortex from '@/components/FaceVortex'

// Erstes Kapitel: dunkle Bühne, auf der sich Akkis Gesicht aus Platten, CDs und Noten zusammensetzt
export default function Hero() {
  const faceRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)
  const [replay, setReplay] = useState(0)

  const handleDone = useCallback(() => setDone(true), [])

  function replayIntro() {
    setDone(false)
    setReplay((n) => n + 1)
  }

  return (
    <section
      id="top"
      data-bg="var(--ink)"
      data-fg="var(--paper)"
      data-intro={done ? 'done' : 'playing'}
      className="chapter hero-stage relative flex min-h-svh flex-col overflow-hidden bg-ink text-paper"
    >
      <FaceVortex targetRef={faceRef} onDone={handleDone} replayToken={replay} />

      <div className="container-page relative grid flex-1 gap-5 pb-6 pt-9 md:grid-cols-12 md:items-center md:pb-7 md:pt-10">
        <div
          ref={faceRef}
          className="order-1 aspect-square w-full max-h-[56svh] justify-self-center md:order-2 md:col-span-7 md:max-h-[78svh]"
        >
          <p className="sr-only">Porträt von DJ Akki, zusammengesetzt aus Schallplatten, CDs und Noten</p>
        </div>

        <div className="hero-copy order-2 flex flex-col gap-5 md:order-1 md:col-span-5">
          <h1 className="font-display text-title font-semibold">
            <span className="block">DJ Akki</span>
            <span className="block text-accent-500">Duisburg</span>
          </h1>
          <p className="max-w-[24ch] font-display text-3xl font-medium">
            Seit über 30 Jahren am Pult. Wedding Award Gewinner 2022.
          </p>
          <p className="max-w-[36ch] text-lg text-paper">
            Event-DJ für Hochzeiten, Firmenfeiern und private Partys in Duisburg und Umgebung.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#kontakt" className="btn btn-red w-full sm:w-auto">
              Wunschtermin anfragen
            </a>
            <button type="button" onClick={replayIntro} className="link text-sm text-gray-400 hover:text-paper">
              Intro nochmal ansehen
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
