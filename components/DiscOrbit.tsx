'use client'

import Image from 'next/image'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useRef } from 'react'

// Vier Leistungen als CDs, die flach unter dem Kinn von rechts nach links rollen.
const discs = [
  {
    label: 'DJ für Hochzeiten',
    href: 'https://www.djakki.de/3/dj-fuer-hochzeiten.html',
    image: 'https://www.djakki.de/bilder/k641930-1208_b117505.png_h200/hochzeit-dj-akki-old-daddy-axel-weyand.png',
    alt: 'DJ Akki auf einer Hochzeit',
  },
  {
    label: 'DJ für Firmenfeiern',
    href: 'https://www.djakki.de/11/dj-fuer-firmenfeier.html',
    image: 'https://www.djakki.de/bilder/k641930-1208_b117493.png_h200/dj-akki-bolero.png',
    alt: 'DJ Akki am Pult im Bolero',
  },
  {
    label: 'DJ für Veranstaltungen',
    href: 'https://www.djakki.de/12/dj-fuer-veranstaltung.html',
    image: 'https://www.djakki.de/bilder/k641930-1208_b117499.png_h200/dj-akki-vs-dj-kosmonova.png',
    alt: 'DJ Akki bei einer Veranstaltung',
  },
  {
    label: 'DJ für Private Events',
    href: 'https://www.djakki.de/10/dj-fuer-private-events.html',
    image: 'https://www.djakki.de/bilder/k641930-1208_b117512.jpg_h200/summer-night-lounge-3.jpg',
    alt: 'Gäste feiern bei der Summer Night Lounge',
  },
]

const LOOP_SECONDS = 18 // eine Runde von rechts nach links
const LANE_Y = 64 // Höhe der Bahn in % der Hero-Fläche, knapp unter dem Kinn
const TRAVEL = 130 // Strecke in %, damit die CDs außerhalb ein- und austreten
const CENTER_X = 50

const hole = 'radial-gradient(circle closest-side, transparent 0 14%, #000 15%)'

function RollingDisc({
  disc,
  index,
  progress,
  reduce,
  setPaused,
}: {
  disc: (typeof discs)[number]
  index: number
  progress: MotionValue<number>
  reduce: boolean | null
  setPaused: (p: boolean) => void
}) {
  // Position auf der Bahn: 0 rechts außen, 1 links außen, versetzt pro CD
  const p = useTransform(progress, (v) => (((v + index * 0.25) % 1) + 1) % 1)
  const left = useTransform(p, (v) => `${CENTER_X + (0.5 - v) * TRAVEL}%`)
  const top = useTransform(p, (v) => `${LANE_Y - Math.sin(Math.PI * v) * 3}%`)
  const rotate = useTransform(progress, (v) => -v * 360 * 4)

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left, top, x: '-50%', y: '-50%', width: 'var(--disc)', height: 'var(--disc)' }}
    >
      <motion.a
        href={disc.href}
        aria-label={disc.label}
        className="pointer-events-auto relative block h-full w-full rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-on-primary"
        initial={reduce ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.7 + index * 0.12 }}
        whileHover={reduce ? undefined : { scale: 1.1 }}
        onHoverStart={() => setPaused(true)}
        onHoverEnd={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <motion.div className="absolute inset-0 rounded-full" style={{ rotate: reduce ? 0 : rotate }}>
          <div
            className="absolute inset-0 rounded-full bg-[#15171b]"
            style={{ boxShadow: '0 12px 24px -8px rgba(0,0,0,.7), inset 0 0 0 1px rgba(255,255,255,.35)' }}
          />
          <div className="absolute inset-0 rounded-full" style={{ WebkitMaskImage: hole, maskImage: hole }}>
            <Image src={disc.image} alt="" fill sizes="160px" className="object-cover" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              WebkitMaskImage: hole,
              maskImage: hole,
              background:
                'conic-gradient(from 40deg, transparent 0deg, rgba(255,255,255,.4) 18deg, transparent 52deg, transparent 200deg, rgba(255,255,255,.25) 226deg, transparent 258deg)',
            }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9dde2]"
            style={{ boxShadow: 'inset 0 0 0 2px rgba(0,0,0,.12)' }}
          />
        </motion.div>

        {/* Beschriftung immer sichtbar, sitzt unter der CD und folgt ihr */}
        <motion.span
          className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-md bg-bg px-3 py-1.5 text-sm font-semibold text-text shadow-md"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 + index * 0.12, ease: 'easeOut' }}
        >
          {disc.label}
        </motion.span>
      </motion.a>
    </motion.div>
  )
}

export default function DiscOrbit() {
  const reduce = useReducedMotion()
  const progress = useMotionValue(0)
  const paused = useRef(false)

  // Die Bahn läuft im Bildtakt und hält an, sobald eine CD angefasst wird
  useAnimationFrame((_, delta) => {
    if (reduce || paused.current) return
    progress.set((progress.get() + delta / 1000 / LOOP_SECONDS) % 1)
  })

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" style={{ ['--disc' as string]: 'clamp(100px, 13vmin, 160px)' }}>
      {discs.map((d, i) => (
        <RollingDisc
          key={d.label}
          disc={d}
          index={i}
          progress={progress}
          reduce={reduce}
          setPaused={(p) => {
            paused.current = p
          }}
        />
      ))}
    </div>
  )
}
