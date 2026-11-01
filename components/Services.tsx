'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'
import Reveal from './Reveal'

// Texte gekürzt aus djakki.de
const services = [
  {
    no: '01',
    tag: 'Hochzeiten',
    title: 'Hochzeiten',
    text: 'Ein eigenes Hochzeitskonzept – vom Sektempfang über den Eröffnungstanz bis zur letzten Zugabe.',
    points: ['Hochzeits-Experte mit Tanzausbildung', 'Musikwünsche im Vorgespräch', 'Wedding Award 2022'],
    href: 'https://www.djakki.de/3/dj-fuer-hochzeiten.html',
    image: {
      src: 'https://www.djakki.de/bilder/k641930-1208_b117514.png_w900/villa-rheinperle.png',
      alt: 'Villa Rheinperle, eine Location, in der DJ Akki aufgelegt hat',
    },
  },
  {
    no: '02',
    tag: 'Firmenfeiern',
    title: 'Firmenfeiern & Events',
    text: 'Musik, die zur Firmenkultur passt – vom entspannten Dinner bis zur Party auf der Tanzfläche.',
    points: ['Für jeden Geschmack etwas dabei', 'Clubabende & Revival-Partys', 'Sound & Light mit dem gewissen Etwas'],
    href: 'https://www.djakki.de/11/dj-fuer-firmenfeier.html',
    image: {
      src: 'https://www.djakki.de/bilder/k641930-1208_b117493.png_w900/dj-akki-bolero.png',
      alt: 'DJ Akki am DJ-Pult im Bolero',
    },
  },
  {
    no: '03',
    tag: 'Private Feiern',
    title: 'Private Feiern',
    text: 'Geburtstag, Jubiläum oder Gartenparty – auf Wunsch auch mit Vinyl-Mix.',
    points: ['House, R’n’B, Partyclassics & Charts', '70er, 80er, 90er und Schlager', 'DJ-Mixing mit Club-Feeling'],
    href: 'https://www.djakki.de/10/dj-fuer-private-events.html',
    image: {
      src: 'https://www.djakki.de/bilder/k641930-1208_b117512.jpg_w1000/summer-night-lounge-3.jpg',
      alt: 'Gäste feiern bei der Summer Night Lounge',
    },
  },
]

// Drei Leistungen als Fotozeilen, abwechselnd links und rechts
export default function Services() {
  const reduce = useReducedMotion()

  return (
    <section id="leistungen" className="section">
      <div className="container-page">
        <Reveal className="mb-20 flex flex-col items-center text-center md:mb-28">
          <span className="eyebrow">Leistungen</span>
          <h2 className="text-4xl md:text-title">
            Drei Anlässe.
            <span className="block font-normal normal-case italic text-muted">Eine Tanzfläche.</span>
          </h2>
        </Reveal>

        <div className="flex flex-col gap-24 md:gap-36">
          {services.map((s, i) => (
            <motion.article
              key={s.no}
              className="grid items-center gap-10 md:grid-cols-2 md:gap-14"
              variants={reduce ? undefined : fadeUp}
              initial={reduce ? false : 'hidden'}
              whileInView={reduce ? undefined : 'show'}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className={`group relative aspect-[4/5] min-w-0 overflow-hidden ${i % 2 ? 'md:order-2' : ''}`}>
                <Image
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover grayscale transition-transform duration-image ease-out group-hover:scale-105"
                />
              </div>

              <div className={`flex min-w-0 flex-col ${i % 2 ? 'md:order-1' : ''}`}>
                <span className="text-xs font-semibold uppercase tracking-label text-muted">
                  {s.no} — {s.tag}
                </span>
                <h3 className="mt-6 font-display text-5xl font-normal uppercase leading-heading md:text-4xl lg:text-5xl">
                  {s.title}
                </h3>
                <p className="mt-6 text-lg text-muted">{s.text}</p>
                <ul className="rule mt-10 flex flex-col gap-4 pt-8 text-sm">
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <a
                  href={s.href}
                  className="group/link mt-12 inline-flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-label underline decoration-1 underline-offset-8"
                >
                  Mehr erfahren
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
