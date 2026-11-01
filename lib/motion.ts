import type { Transition, Variants } from 'framer-motion'

// Gemeinsame Motion-Werte: dezent, 0.4–0.8s
export const ease = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export const quick: Transition = { duration: 0.15, ease: 'easeOut' }
