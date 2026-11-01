'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'

// Ruhige Einleitung: ein Satz in großer Serife, mittig, viel Luft drumherum
export default function Intro() {
  const reduce = useReducedMotion()

  return (
    <section id="intro" className="section">
      <motion.div
        className="container-page flex flex-col items-center text-center"
        variants={reduce ? undefined : fadeUp}
        initial={reduce ? false : 'hidden'}
        whileInView={reduce ? undefined : 'show'}
        viewport={{ once: true, amount: 0.4 }}
      >
        <span className="eyebrow">Willkommen</span>
        <p className="max-w-[24ch] font-display text-4xl font-normal leading-heading [text-wrap:balance] md:text-title md:leading-display">
          Seit über drei Jahrzehnten bringe ich Menschen in Duisburg und am Niederrhein auf die Tanzfläche –{' '}
          <em className="text-muted">mit Gespür für den Moment.</em>
        </p>
        <p className="mt-10 max-w-measure text-muted">
          Jede Feier wird im Vorgespräch individuell geplant: Musik, Ablauf und Technik, passend zu euren Gästen und eurer
          Location.
        </p>
      </motion.div>
    </section>
  )
}
