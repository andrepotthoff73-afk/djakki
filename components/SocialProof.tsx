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
    <section id="bewertungen" className="section bg-bg">
      <div className="container-page">
        {/* Kennzahlen als Karten */}
        <motion.dl
          className="grid grid-cols-2 gap-3 lg:grid-cols-4"
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.4 }}
        >
          {facts.map((f) => (
            <motion.div key={f.label} variants={reduce ? undefined : fadeUp} className="flex flex-col justify-between gap-6 rounded-2xl bg-surface p-5 md:p-6">
              <dd className="text-4xl font-bold tracking-tight text-primary-600">{f.value}</dd>
              <dt className="text-sm text-muted">{f.label}</dt>
            </motion.div>
          ))}
        </motion.dl>

        <div className="mt-3 grid gap-3 lg:grid-cols-[7fr_5fr]">
          {/* Großes Zitat */}
          <Reveal className="flex flex-col justify-between gap-8 rounded-2xl bg-dark p-6 text-on-primary md:p-8 lg:p-9">
            <div>
              <span className="eyebrow eyebrow-dark">Kundenstimmen</span>
              <figure className="mt-2">
                <blockquote className="text-3xl font-bold leading-heading tracking-tight [text-wrap:balance]">
                  „{featured.text.split('!')[0]}!“
                </blockquote>
              </figure>
            </div>
            <figcaption className="flex items-center gap-3 text-sm">
              <Image src={avatars[featured.author]} alt="" width={48} height={48} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <strong className="flex items-center gap-2 font-semibold">
                  {featured.author}
                  <Stars count={featured.stars} size={14} />
                </strong>
                <span className="text-on-primary-muted">
                  {featured.event} · {formatDate(featured.date)}
                </span>
              </div>
            </figcaption>
          </Reveal>

          {/* Weitere Bewertungen */}
          <motion.div
            className="grid gap-3"
            variants={reduce ? undefined : stagger}
            initial={reduce ? false : 'hidden'}
            whileInView={reduce ? undefined : 'show'}
            viewport={{ once: true, amount: 0.2 }}
          >
            {rest.map((r) => (
              <motion.figure
                key={r.author}
                variants={reduce ? undefined : fadeUp}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-bg p-5 md:p-6"
              >
                <Stars count={r.stars} size={16} />
                <blockquote className="text-text">{r.text}</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 text-sm">
                  <Image src={avatars[r.author]} alt="" width={48} height={48} className="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <strong className="block font-semibold">{r.author}</strong>
                    <span className="text-muted">
                      {r.event} · {formatDate(r.date)}
                    </span>
                  </div>
                </figcaption>
              </motion.figure>
            ))}

            <p className="px-1 text-sm text-muted">
              Alle Bewertungen auf{' '}
              <a href="https://www.djakki.de/13/zu-den-kundenstimmen.html" className="font-semibold text-primary-600 underline-offset-4 hover:underline">
                djakki.de
              </a>
            </p>
          </motion.div>
        </div>

        {/* Referenz-Locations */}
        <Reveal className="mt-8 border-t border-border pt-6">
          <p className="eyebrow mb-4">Hier habe ich schon aufgelegt</p>
          <div className="text-text">
            <Marquee items={site.referenceLocations} speed={45} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
