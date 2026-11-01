'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { site } from '@/lib/site'
import { fadeUp } from '@/lib/motion'
import Reveal from './Reveal'
import { ArrowRightIcon, PhoneIcon } from './Icons'

// Ablauf nach djakki.de: Anfrageformular, Vorgespräch mit Musikwünschen, Booking oder Full Service
const steps = [
  {
    title: 'Unverbindlich anfragen',
    text: 'Datum, Anlass und Ort per Formular, Telefon oder WhatsApp schicken – ich melde mich persönlich.',
  },
  {
    title: 'Vorgespräch',
    text: 'Wir sprechen über Ablauf, Lieblingsgenres und Musikwünsche. Daraus entsteht ein individuelles Musikprogramm.',
  },
  {
    title: 'Paket festlegen',
    text: 'Nur DJ-Booking oder Full Service inklusive Ton- und Lichtanlage – passend zu Location und Gästezahl.',
  },
  {
    title: 'Feiern',
    text: 'Das passende Lied zum passenden Zeitpunkt – und eine Tanzfläche, die bis zum Schluss voll bleibt.',
  },
]

export default function Booking() {
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLOListElement>(null)
  // Fortschrittslinie folgt dem Scrollen durch die Schritte
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="ablauf" className="section bg-bg">
      <div className="container-page grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-8">
        <Reveal className="lg:sticky lg:top-9 lg:self-start">
          <span className="eyebrow">So läuft die Buchung</span>
          <h2 className="max-w-measure text-3xl">In vier Schritten zur vollen Tanzfläche</h2>
          <p className="mt-3 max-w-measure text-lg text-muted">
            Kein Paketdschungel: Jede Feier wird individuell besprochen und geplant.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#kontakt" className="btn btn-primary group">
              Wunschtermin anfragen
              <ArrowRightIcon width={20} height={20} className="transition-transform duration-fast group-hover:translate-x-1" />
            </a>
            <a href={site.contact.phoneHref} className="btn btn-ghost">
              <PhoneIcon width={20} height={20} />
              Lieber anrufen
            </a>
          </div>
        </Reveal>

        <ol ref={listRef} className="relative grid gap-6 pl-8 md:gap-7 md:pl-9">
          {/* Linie: grau als Spur, blau als Fortschritt */}
          <span aria-hidden className="absolute bottom-3 left-4 top-3 w-px -translate-x-1/2 bg-border md:left-5" />
          <motion.span
            aria-hidden
            className="absolute bottom-3 left-4 top-3 w-px origin-top -translate-x-1/2 bg-primary-600 md:left-5"
            style={{ scaleY: reduce ? 1 : progress }}
          />

          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative"
              variants={reduce ? undefined : fadeUp}
              initial={reduce ? false : 'hidden'}
              whileInView={reduce ? undefined : 'show'}
              viewport={{ once: true, amount: 0.6 }}
            >
              <span
                aria-hidden
                className="absolute left-[calc(var(--space-4)-var(--space-8))] top-0 grid h-btn-sm w-btn-sm -translate-x-1/2 place-items-center rounded-full border border-primary-600 bg-bg text-sm font-bold text-primary-600 md:left-[calc(var(--space-5)-var(--space-9))]"
              >
                {i + 1}
              </span>
              <h3 className="text-xl">
                <span className="sr-only">Schritt {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-2 max-w-measure text-muted">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
