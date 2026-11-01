'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/site'
import { ease } from '@/lib/motion'

// Vollbild-Foto in Graustufen, darüber eine große Serifen-Headline
export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="top" className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink text-paper">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease }}
      >
        <Image
          src="https://www.djakki.de/bilder/k641930-1208_b112906.jpg/dj-akki-plastique-revival.jpg"
          alt="DJ Akki am DJ-Pult bei der Plastique Revival Party"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%] grayscale"
        />
      </motion.div>
      <div className="veil absolute inset-0" aria-hidden />

      <div className="container-page relative flex flex-col items-center pb-24 pt-32 text-center">
        <motion.span
          className="mb-10 text-xs font-semibold uppercase tracking-label text-on-primary"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Event-DJ · Duisburg · seit über 30 Jahren
        </motion.span>

        <motion.h1
          className="font-display text-display font-medium uppercase"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.4 }}
        >
          DJ Akki
          <span className="block font-normal normal-case italic text-on-primary-muted">&amp; Friends</span>
        </motion.h1>

        <motion.p
          className="mt-10 max-w-measure text-lg text-on-primary [text-wrap:pretty]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Volle Tanzfläche für eure Hochzeit, Firmenfeier oder Party – mit House, R’n’B und Partyclassics.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <a href="#kontakt" className="btn btn-light btn-lg">
            Termin anfragen
          </a>
        </motion.div>
      </div>

    </section>
  )
}
