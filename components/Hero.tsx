'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { site } from '@/lib/site'
import { ease } from '@/lib/motion'
import { ArrowRightIcon, PhoneIcon } from './Icons'
import DiscOrbit from './DiscOrbit'

// Headline Wort für Wort, damit jedes Wort einzeln einblenden kann
const words = ['Volle', 'Tanzfläche', 'für', 'eure', 'Hochzeit,', 'Firmenfeier', '&', 'Party.']

export default function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  // Beim Scrollen wandert das Foto langsamer als der Text, der Text verblasst
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const rating = site.reviews?.rating

  const stats = [
    { value: '30+', label: 'Jahre Erfahrung' },
    { value: rating ? rating.toFixed(1).replace('.', ',') : '–', label: `${site.reviews?.count ?? 0} Kundenstimmen` },
    { value: String(site.serviceArea.length), label: 'Städte am Niederrhein' },
  ]

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-dark text-on-primary"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: reduce ? '0%' : photoY }}
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease }}
      >
        <Image
          src="https://www.djakki.de/bilder/k641930-1208_b112906.jpg/dj-akki-plastique-revival.jpg"
          alt="DJ Akki am DJ-Pult bei der Plastique Revival Party"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
      </motion.div>
      <div className="scrim absolute inset-0 -z-10" aria-hidden />
      <DiscOrbit />

      {/* Der Text lässt Klicks durch, damit die CDs dahinter anklickbar bleiben. Nur Buttons fangen Klicks ab. */}
      <motion.div
        className="container-page pointer-events-none relative flex flex-col gap-6 pb-8 pt-28 lg:pb-9"
        style={{ opacity: reduce ? 1 : contentOpacity }}
      >
        <motion.span
          className="glass hidden w-fit items-center gap-2 rounded-full border border-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-label text-on-primary sm:inline-flex"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="h-2 w-2 rounded-full bg-accent-500" aria-hidden />
          Event-DJ aus Duisburg
        </motion.span>

        <h1 className="max-w-[20ch] text-display [text-wrap:balance]">
          {words.map((w, i) => (
            <span key={w + i}>
              <motion.span
                className={`inline-block ${w === 'Hochzeit,' ? 'text-primary-200' : ''}`}
                initial={reduce ? false : { opacity: 0, y: '0.4em' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.2 + i * 0.08 }}
              >
                {w}
              </motion.span>
              {i < words.length - 1 && ' '}
            </span>
          ))}
        </h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.div
            className="flex max-w-measure flex-col gap-6"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 1 }}
          >
            <p className="text-lg text-on-primary-muted [text-wrap:pretty]">
              DJ Akki legt seit über drei Jahrzehnten in Duisburg und am Niederrhein auf – mit House, R’n’B und
              Partyclassics. Jede Feier wird im Vorgespräch individuell geplant.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <motion.a
                href="#kontakt"
                className="pointer-events-auto btn btn-light btn-lg group"
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Wunschtermin anfragen
                <ArrowRightIcon width={20} height={20} className="transition-transform duration-fast group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                href={site.contact.phoneHref}
                className="pointer-events-auto btn btn-outline btn-lg"
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <PhoneIcon width={20} height={20} />
                Anrufen
              </motion.a>
            </div>
          </motion.div>

          <motion.dl
            className="glass grid w-full grid-cols-3 divide-x divide-neutral-800 overflow-hidden rounded-2xl border border-neutral-800 lg:w-auto lg:min-w-[28rem]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 px-4 py-4 md:px-5">
                <dt className="order-2 text-xs text-on-primary-muted">{s.label}</dt>
                <dd className="text-2xl font-bold tracking-tight text-on-primary md:text-3xl">{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  )
}
