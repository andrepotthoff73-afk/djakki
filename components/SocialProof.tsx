'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/site'
import { ease, fadeUp, stagger } from '@/lib/motion'
import Reveal from './Reveal'
import Marquee from './Marquee'
import { StarIcon } from './Icons'

const avatars: Record<string, string> = {
  'Matthias & Ari': 'https://www.djakki.de/bilder/k641930-1208_b113278.jpg_w90_h90/113278.jpg',
  Dennis: 'https://www.djakki.de/bilder/k641930-1208_b113279.jpg_w90_h90/113279.jpg',
  Svenja: 'https://www.djakki.de/bilder/k641930-1208_b113280.jpg_w90_h90/113280.jpg',
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })

// Zählt beim ersten Sichtkontakt von 0 hoch
function CountUp({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const format = (v: number) => v.toFixed(decimals).replace('.', ',') + suffix

  useEffect(() => {
    if (!inView || !ref.current) return
    if (reduce) {
      ref.current.textContent = format(to)
      return
    }
    const controls = animate(0, to, {
      duration: 1.2,
      ease,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, to])

  return <span ref={ref}>{format(to)}</span>
}

function Stars({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <span className="flex justify-center gap-1 text-primary-600" role="img" aria-label={`${count} von 5 Sternen`}>
      {Array.from({ length: Math.round(count) }, (_, i) => (
        <StarIcon key={i} width={size} height={size} />
      ))}
    </span>
  )
}

export default function SocialProof() {
  const reduce = useReducedMotion()
  const reviews = site.reviews
  if (!reviews) return null
  const [featured, ...rest] = reviews.items

  const facts = [
    { value: <CountUp to={30} suffix="+" />, label: 'Jahre Erfahrung' },
    { value: <CountUp to={reviews.rating} decimals={1} />, label: `Sterne aus ${reviews.count} Bewertungen` },
    { value: '2022', label: 'Wedding Award' },
    { value: <CountUp to={site.serviceArea.length} />, label: 'Städte am Niederrhein' },
  ]

  return (
    <section id="bewertungen" className="section">
      <div className="container-page">
        <Reveal className="mb-16 flex flex-col items-center text-center">
          <span className="eyebrow">Stimmen</span>
          <h2 className="text-4xl md:text-title">Kundenstimmen</h2>
        </Reveal>

        {/* Kennzahlen als feine Spalten */}
        <motion.dl
          className="rule grid grid-cols-2 gap-y-12 pt-12 md:grid-cols-4"
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.4 }}
        >
          {facts.map((f) => (
            <motion.div key={f.label} variants={reduce ? undefined : fadeUp} className="flex flex-col items-center gap-4 text-center">
              <dd className="font-display text-5xl font-normal leading-none md:text-title">{f.value}</dd>
              <dt className="text-xs font-semibold uppercase tracking-label text-muted">{f.label}</dt>
            </motion.div>
          ))}
        </motion.dl>

        {/* Großes Zitat */}
        <Reveal className="mx-auto mt-28 flex max-w-[34ch] flex-col items-center gap-8 text-center">
          <Stars count={featured.stars} size={18} />
          <blockquote className="font-display text-4xl italic leading-heading [text-wrap:balance] md:text-title md:leading-display">
            „{featured.text.split('!')[0]}!“
          </blockquote>
          <figcaption className="flex flex-col items-center gap-3 text-xs font-semibold uppercase tracking-label">
            <Image src={avatars[featured.author]} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover grayscale" />
            <span>{featured.author}</span>
            <span className="font-normal normal-case tracking-normal text-muted">
              {featured.event} · {formatDate(featured.date)}
            </span>
          </figcaption>
        </Reveal>

        {/* Weitere Stimmen */}
        <motion.div
          className="mt-32 grid gap-16 md:grid-cols-2 md:gap-12"
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
        >
          {rest.map((r) => (
            <motion.figure key={r.author} variants={reduce ? undefined : fadeUp} className="rule flex flex-col gap-6 pt-10">
              <Stars count={r.stars} />
              <blockquote className="font-display text-2xl leading-heading">{r.text}</blockquote>
              <figcaption className="mt-auto flex items-center gap-4 text-sm">
                <Image src={avatars[r.author]} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover grayscale" />
                <div>
                  <strong className="block font-semibold">{r.author}</strong>
                  <span className="text-muted">
                    {r.event} · {formatDate(r.date)}
                  </span>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>

        <p className="mt-16 text-center text-sm text-muted">
          Alle Bewertungen auf{' '}
          <a href="https://www.djakki.de/13/zu-den-kundenstimmen.html" className="text-ink underline underline-offset-4">
            djakki.de
          </a>
        </p>

        {/* Referenz-Locations */}
        <Reveal className="rule mt-28 pt-12">
          <p className="eyebrow text-center">Hier habe ich schon aufgelegt</p>
          <div className="text-ink">
            <Marquee items={site.referenceLocations} speed={50} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
