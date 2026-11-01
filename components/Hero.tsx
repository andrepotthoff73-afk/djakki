'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { site } from '@/lib/site'
import { ease } from '@/lib/motion'
import { ArrowRightIcon, PhoneIcon, StarIcon } from './Icons'

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

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-svh items-end overflow-hidden bg-dark text-on-primary"
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

      <motion.div className="container-page relative pb-8 pt-10 lg:pb-9" style={{ opacity: reduce ? 1 : contentOpacity }}>
        <motion.span
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-on-primary-muted px-3 py-1 text-xs font-semibold uppercase tracking-label text-on-primary"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="h-2 w-2 rounded-full bg-accent-500" aria-hidden />
          Event-DJ aus Duisburg · seit über 30 Jahren
        </motion.span>

        <h1 className="max-w-[16ch] text-display [text-wrap:balance]">
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

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.div
            className="flex flex-col gap-5"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 1 }}
          >
            <p className="max-w-measure text-lg text-on-primary-muted [text-wrap:pretty]">
              DJ Akki legt seit über drei Jahrzehnten in Duisburg und am Niederrhein auf – mit House, R’n’B und
              Partyclassics. Jede Feier wird im Vorgespräch individuell geplant.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <motion.a
                href="#kontakt"
                className="btn btn-primary btn-lg group"
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Wunschtermin anfragen
                <ArrowRightIcon width={20} height={20} className="transition-transform duration-fast group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                href={site.contact.phoneHref}
                className="btn btn-lg border border-on-primary-muted text-on-primary hover:bg-neutral-800"
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <PhoneIcon width={20} height={20} />
                {site.contact.phone}
              </motion.a>
            </div>
          </motion.div>

          {rating && (
            <motion.div
              className="flex items-center gap-3 text-sm text-on-primary-muted"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <span className="flex gap-1 text-accent-500" role="img" aria-label={`${rating} von 5 Sternen`}>
                {Array.from({ length: Math.round(rating) }, (_, i) => (
                  <StarIcon key={i} width={16} height={16} />
                ))}
              </span>
              <span>
                <strong className="font-semibold text-on-primary">{rating.toFixed(1).replace('.', ',')}</strong> aus{' '}
                {site.reviews.count} Kundenbewertungen
              </span>
            </motion.div>
          )}
        </div>

      </motion.div>
    </section>
  )
}
