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
    <section id="faq" className="section bg-bg">
      <div className="container-page grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-8">
        <Reveal>
          <span className="eyebrow">FAQ</span>
          <h2 className="text-3xl md:text-4xl">Häufige Fragen</h2>
          <p className="mt-3 text-muted">
            Nicht dabei? Ruf einfach an unter{' '}
            <a href={site.contact.phoneHref} className="font-semibold text-primary-600 hover:underline">
              {site.contact.phone}
            </a>
            .
          </p>
        </Reveal>

        <motion.ul
          className="grid content-start gap-3"
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.li
                key={f.q}
                variants={reduce ? undefined : fadeUp}
                className={`rounded-2xl px-5 transition-colors duration-card md:px-6 ${isOpen ? 'bg-surface' : 'bg-bg ring-1 ring-inset ring-border'}`}
              >
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold transition-colors duration-fast hover:text-primary-600"
                  >
                    {f.q}
                    <motion.span
                      className="grid h-btn-sm w-btn-sm shrink-0 place-items-center rounded-full bg-primary-50 text-primary-600"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease }}
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
                      transition={{ duration: 0.3, ease }}
                    >
                      <p className="max-w-measure pb-5 text-muted">{f.a}</p>
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
