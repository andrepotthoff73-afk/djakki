'use client'

import { motion, useReducedMotion } from 'framer-motion'

// Endlos-Laufband in Serifen-Kursiv: der Inhalt wird einmal verdoppelt, dann um die Hälfte verschoben
export default function Marquee({ items, speed = 35 }: { items: string[]; speed?: number }) {
  const reduce = useReducedMotion()
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden">
      <motion.ul
        className="flex w-max items-center"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((text, i) => (
          <li
            key={`${text}-${i}`}
            aria-hidden={i >= items.length}
            className="flex items-center whitespace-nowrap font-display text-3xl italic leading-none md:text-4xl"
          >
            {text}
            <span aria-hidden className="mx-10 not-italic text-muted">
              —
            </span>
          </li>
        ))}
      </motion.ul>
    </div>
  )
}
