'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ease } from '@/lib/motion'
import { ArrowRightIcon, BriefcaseIcon, CakeIcon, CheckIcon, RingsIcon } from './Icons'

// Texte gekürzt aus djakki.de
const services = [
  {
    no: '01',
    icon: RingsIcon,
    title: 'Hochzeiten',
    text: 'Ein eigenes Hochzeitskonzept – vom Sektempfang über den Eröffnungstanz bis zur letzten Zugabe.',
    points: ['Hochzeits-Experte mit Tanzausbildung', 'Musikwünsche im Vorgespräch', 'Wedding Award 2022'],
    href: 'https://www.djakki.de/3/dj-fuer-hochzeiten.html',
    image: {
      src: 'https://www.djakki.de/bilder/k641930-1208_b117514.png_w900/villa-rheinperle.png',
      alt: 'Villa Rheinperle, eine Location, in der DJ Akki aufgelegt hat',
    },
  },
  {
    no: '02',
    icon: BriefcaseIcon,
    title: 'Firmenfeiern & Events',
    text: 'Musik, die zur Firmenkultur passt – vom entspannten Dinner bis zur Party auf der Tanzfläche.',
    points: ['Für jeden Geschmack etwas dabei', 'Clubabende & Revival-Partys', 'Sound & Light mit dem gewissen Etwas'],
    href: 'https://www.djakki.de/11/dj-fuer-firmenfeier.html',
    image: {
      src: 'https://www.djakki.de/bilder/k641930-1208_b117493.png_w900/dj-akki-bolero.png',
      alt: 'DJ Akki am DJ-Pult im Bolero',
    },
  },
  {
    no: '03',
    icon: CakeIcon,
    title: 'Private Feiern',
    text: 'Geburtstag, Jubiläum oder Gartenparty – auf Wunsch auch mit Vinyl-Mix.',
    points: ['House, R’n’B, Partyclassics & Charts', '70er, 80er, 90er und Schlager', 'DJ-Mixing mit Club-Feeling'],
    href: 'https://www.djakki.de/10/dj-fuer-private-events.html',
    image: {
      src: 'https://www.djakki.de/bilder/k641930-1208_b117512.jpg_w1000/summer-night-lounge-3.jpg',
      alt: 'Gäste feiern bei der Summer Night Lounge',
    },
  },
]

type Service = (typeof services)[number]

// Eine Leistung als Vollbild-Panel: Foto links, Text rechts. Eigenes Zeitfenster im Scrollweg.
function Panel({
  s,
  index,
  progress,
}: {
  s: Service
  index: number
  progress: MotionValue<number>
}) {
  const n = services.length
  const first = index === 0
  const last = index === n - 1
  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  const start = index / n
  const end = (index + 1) / n

  // Ein- und Ausblenden mit streng steigenden Zeitpunkten zwischen 0 und 1
  const opacityIn = first ? [0] : [clamp(start - 0.08), clamp(start)]
  const opacityInValues = first ? [1] : [0, 1]
  const opacityOut = last ? [] : [clamp(end - 0.08), clamp(end)]
  const opacityOutValues = last ? [] : [1, 0]
  const opacity = useTransform(progress, [...opacityIn, ...opacityOut], [...opacityInValues, ...opacityOutValues])

  const scale = useTransform(progress, [clamp(start), clamp(end)], [1.12, 1])
  const textY = useTransform(progress, [clamp(start), clamp(start + 0.12)], [60, 0])
  const Icon = s.icon

  return (
    <motion.div
      className="absolute inset-0 grid items-center gap-6 px-3 pb-8 pt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-9 lg:px-5"
      style={{ opacity }}
    >
      <div className="relative h-[30svh] overflow-hidden rounded-2xl md:h-[40svh] lg:h-[min(72svh,640px)]">
        <motion.div className="absolute inset-0" style={{ scale }}>
          <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
        </motion.div>
        <span className="glass absolute bottom-4 left-4 rounded-full border border-neutral-800 px-4 py-2 text-sm font-semibold text-on-primary">
          {s.no} / 0{services.length}
        </span>
      </div>

      <motion.div className="flex flex-col gap-5 px-1 lg:px-0" style={{ y: textY }}>
        <div className="grid h-btn-lg w-btn-lg place-items-center rounded-2xl bg-primary-600 text-on-primary">
          <Icon width={24} height={24} />
        </div>
        <h2 className="text-4xl text-on-primary">{s.title}</h2>
        <p className="max-w-measure text-lg text-on-primary-muted">{s.text}</p>
        <ul className="grid gap-3 border-t border-neutral-800 pt-5">
          {s.points.map((p) => (
            <li key={p} className="flex items-start gap-3 font-semibold text-on-primary">
              <CheckIcon width={20} height={20} className="mt-px shrink-0 text-accent-500" />
              {p}
            </li>
          ))}
        </ul>
        <a
          href={s.href}
          className="btn btn-light group mt-2 w-fit"
        >
          Mehr erfahren
          <ArrowRightIcon width={18} height={18} className="transition-transform duration-fast group-hover:translate-x-1" />
        </a>
      </motion.div>
    </motion.div>
  )
}

export default function PinnedServices() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Mit reduzierter Bewegung: gleiche Inhalte untereinander, ohne Anheften
  if (reduce) {
    return (
      <section id="leistungen" className="bg-dark py-8 text-on-primary">
        <div className="container-page grid gap-8">
          <span className="eyebrow text-on-primary-muted">Leistungen</span>
          {services.map((s) => (
            <div key={s.title} className="grid gap-5 lg:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-4xl">{s.title}</h2>
                <p className="text-on-primary-muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="leistungen" ref={ref} className="relative h-[300svh] bg-dark text-on-primary">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="container-page absolute left-0 right-0 top-0 z-10 flex items-center justify-between pt-24">
          <span className="eyebrow mb-0 text-on-primary-muted">Leistungen</span>
          <motion.span
            className="h-px w-24 origin-left bg-on-primary-muted"
            style={{ scaleX: scrollYProgress }}
            transition={{ ease }}
            aria-hidden
          />
        </div>
        {services.map((s, i) => (
          <Panel key={s.title} s={s} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}
