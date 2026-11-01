'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ease, fadeUp, stagger } from '@/lib/motion'
import { site } from '@/lib/site'
import Reveal from './Reveal'
import { PlusIcon } from './Icons'

// Antworten nur mit Angaben von djakki.de
const faqs = [
  {
    q: 'Wie läuft eine Anfrage ab?',
    a: 'Du schickst Datum, Anlass und Ort per Formular, Telefon oder WhatsApp. Danach gibt es ein Vorgespräch zu Ablauf und Musikwünschen.',
  },
  {
    q: 'Was ist im Full Service enthalten?',
    a: 'Neben dem DJ-Booking auch die Ton- und Lichtanlage. Alternativ buchst du nur den DJ.',
  },
  {
    q: 'In welchen Städten legst du auf?',
    a: 'Regelmäßig in Duisburg, Krefeld, Moers, Neukirchen-Vluyn und Rheinberg. Für andere Orte frag einfach an.',
  },
  {
    q: 'Welche Musik spielst du?',
    a: 'House, R’n’B und Partyclassics, dazu Charts, 70er, 80er, 90er und Schlager. Musikwünsche nehme ich im Vorgespräch auf.',
  },
  {
    q: 'Gibt es feste Öffnungszeiten?',
    a: 'Nein. Termine werden nach Absprache vereinbart.',
  },
]

export default function FAQ() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section">
      <div className="container-page grid gap-12 lg:grid-cols-[4fr_7fr] lg:gap-20">
        <Reveal>
          <span className="eyebrow">FAQ</span>
          <h2 className="text-4xl md:text-title">Häufige Fragen</h2>
          <p className="mt-6 max-w-measure text-muted">
            Nicht dabei? Ruf einfach an unter{' '}
            <a href={site.contact.phoneHref} className="text-ink underline underline-offset-4">
              {site.contact.phone}
            </a>
            .
          </p>
        </Reveal>

        <motion.ul
          className="border-b border-border"
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.li key={f.q} variants={reduce ? undefined : fadeUp} className="rule">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-7 text-left font-display text-2xl transition-opacity duration-fast hover:opacity-60 md:text-3xl"
                  >
                    {f.q}
                    <motion.span
                      className="grid h-btn-sm w-btn-sm shrink-0 place-items-center"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease }}
                      aria-hidden
                    >
                      <PlusIcon width={24} height={24} />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      className="overflow-hidden"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <p className="max-w-measure pb-8 text-lg text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
