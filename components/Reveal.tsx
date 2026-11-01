'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { fadeUp } from '@/lib/motion'

type Props = HTMLMotionProps<'div'> & { delay?: number }

// Scroll-Reveal: blendet beim ersten Sichtkontakt ein, ohne Animation bei reduzierter Bewegung
export default function Reveal({ delay = 0, children, ...props }: Props) {
  const reduce = useReducedMotion()
  if (reduce) return <motion.div {...props}>{children}</motion.div>
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
