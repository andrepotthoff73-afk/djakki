'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/site'
import { fadeUp, stagger } from '@/lib/motion'
import Reveal from './Reveal'

// Ablauf nach djakki.de: Anfrageformular, Vorgespräch mit Musikwünschen, Booking oder Full Service
const steps = [
  {
    title: 'Anfragen',
    text: 'Datum, Anlass und Ort per Formular, Telefon oder WhatsApp schicken – ich melde mich persönlich.',
  },
  {
    title: 'Vorgespräch',
    text: 'Wir sprechen über Ablauf, Lieblingsgenres und Musikwünsche. Daraus entsteht ein individuelles Musikprogramm.',
  },
  {
    title: 'Paket wählen',
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
    <section id="ablauf" className="section bg-paper-2">
      <div className="container-page">
        <Reveal className="mb-20 flex flex-col items-center text-center">
          <span className="eyebrow">Ablauf</span>
          <h2 className="text-4xl md:text-title">So buchst du</h2>
          <p className="mt-8 max-w-measure text-lg text-muted">
            Kein Paketdschungel: Jede Feier wird individuell besprochen und geplant.
          </p>
        </Reveal>

        <motion.ol
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((s, i) => (
            <motion.li key={s.title} variants={reduce ? undefined : fadeUp} className="rule flex flex-col gap-5 pt-8">
              <span className="font-display text-6xl italic leading-none text-muted md:text-7xl">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2">
                <span className="sr-only">Schritt {i + 1}: </span>
                {s.title}
              </h3>
              <p className="text-muted">{s.text}</p>
            </motion.li>
          ))}
        </motion.ol>

        <Reveal className="mt-20 flex justify-center">
          <a href="#kontakt" className="btn btn-ink btn-lg">
            Termin anfragen
          </a>
        </Reveal>
        <p className="mt-6 text-center text-sm text-muted">
          Oder direkt anrufen:{' '}
          <a href={site.contact.phoneHref} className="text-ink underline underline-offset-4">
            {site.contact.phone}
          </a>
        </p>
      </div>
    </section>
  )
}
