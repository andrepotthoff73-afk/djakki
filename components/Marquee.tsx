'use client'

import { motion, useReducedMotion } from 'framer-motion'

// Endlos-Laufband: der Inhalt wird einmal verdoppelt, dann um die Hälfte verschoben
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
            className="flex items-center whitespace-nowrap text-2xl font-semibold tracking-tight"
          >
            {text}
            <span aria-hidden className="mx-8 text-primary-200">
              •
            </span>
          </li>
        ))}
      </motion.ul>
    </div>
  )
}
