'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/site'
import { fadeUp, stagger } from '@/lib/motion'
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

  return (
    <section id="ablauf" className="section bg-surface">
      <div className="container-page">
        <Reveal className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="eyebrow">So läuft die Buchung</span>
            <h2 className="max-w-measure text-3xl md:text-4xl">In vier Schritten zur vollen Tanzfläche</h2>
            <p className="mt-3 max-w-measure text-lg text-muted">
              Kein Paketdschungel: Jede Feier wird individuell besprochen und geplant.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#kontakt" className="btn btn-primary group">
              Wunschtermin anfragen
              <ArrowRightIcon width={20} height={20} className="transition-transform duration-fast group-hover:translate-x-1" />
            </a>
            <a href={site.contact.phoneHref} className="btn btn-secondary">
              <PhoneIcon width={20} height={20} />
              Lieber anrufen
            </a>
          </div>
        </Reveal>

        <motion.ol
          className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-4"
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              variants={reduce ? undefined : fadeUp}
              className="flex flex-col gap-4 rounded-2xl bg-bg p-5 shadow-sm md:p-6"
            >
              <span aria-hidden className="text-4xl font-bold tracking-tight text-primary-600">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl">
                <span className="sr-only">Schritt {i + 1}: </span>
                {s.title}
              </h3>
              <p className="text-muted">{s.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
