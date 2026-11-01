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
      duration: 0.8,
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

function Stars({ count, size = 20 }: { count: number; size?: number }) {
  return (
    <span className="flex gap-1 text-accent-500" role="img" aria-label={`${count} von 5 Sternen`}>
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
    { value: '2022', label: 'Wedding Award Gewinner' },
    { value: <CountUp to={site.serviceArea.length} />, label: 'Städte am Niederrhein' },
  ]

  return (
    <section id="bewertungen" className="section bg-dark text-on-primary">
      <div className="container-page">
        {/* Zahlenleiste */}
        <motion.dl
          className="grid grid-cols-2 gap-x-3 gap-y-5 border-b border-neutral-800 pb-7 lg:grid-cols-4"
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.4 }}
        >
          {facts.map((f) => (
            <motion.div key={f.label} variants={reduce ? undefined : fadeUp} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-on-primary-muted">{f.label}</dt>
              <dd className="text-3xl font-bold tracking-tight">{f.value}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <div className="mt-7 grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-7">
          {/* Großes Zitat */}
          <Reveal>
            <span className="eyebrow text-on-primary-muted">Kundenstimmen</span>
            <h2 className="text-3xl">Das sagen Brautpaare &amp; Gastgeber</h2>

            <figure className="mt-6">
              <Stars count={featured.stars} />
              <blockquote className="mt-3 text-2xl font-semibold leading-lead tracking-tight [text-wrap:pretty]">
                „{featured.text.split('!')[0]}!“
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 text-sm">
                <Image
                  src={avatars[featured.author]}
                  alt=""
                  width={48}
                  height={48}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <div>
                  <strong className="block font-semibold">{featured.author}</strong>
                  <span className="text-on-primary-muted">
                    {featured.event} · {formatDate(featured.date)}
                  </span>
                </div>
              </figcaption>
            </figure>
          </Reveal>

          {/* Weitere Bewertungen */}
          <motion.div
            className="grid content-start gap-3 md:gap-4"
            variants={reduce ? undefined : stagger}
            initial={reduce ? false : 'hidden'}
            whileInView={reduce ? undefined : 'show'}
            viewport={{ once: true, amount: 0.2 }}
          >
            {rest.map((r) => (
              <motion.figure
                key={r.author}
                variants={reduce ? undefined : fadeUp}
                whileHover={reduce ? undefined : { y: -2 }}
                className="rounded-lg bg-bg p-4 text-text shadow-md transition-shadow duration-card hover:shadow-lg md:p-5"
              >
                <Stars count={r.stars} size={16} />
                <blockquote className="mt-3">{r.text}</blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-sm">
                  <Image src={avatars[r.author]} alt="" width={48} height={48} className="h-6 w-6 rounded-full object-cover" />
                  <div>
                    <strong className="block font-semibold">{r.author}</strong>
                    <span className="text-muted">
                      {r.event} · {formatDate(r.date)}
                    </span>
                  </div>
                </figcaption>
              </motion.figure>
            ))}

            <p className="text-sm text-on-primary-muted">
              Alle Bewertungen auf{' '}
              <a
                href="https://www.djakki.de/13/zu-den-kundenstimmen.html"
                className="font-semibold text-on-primary underline-offset-4 hover:underline"
              >
                djakki.de
              </a>
            </p>
          </motion.div>
        </div>

        {/* Referenz-Locations */}
        <Reveal className="mt-7 border-t border-neutral-800 pt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-label text-on-primary-muted">
            Hier habe ich schon aufgelegt
          </p>
          <div className="text-on-primary">
            <Marquee items={site.referenceLocations} speed={45} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
