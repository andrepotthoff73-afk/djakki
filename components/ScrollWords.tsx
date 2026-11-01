'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

const text =
  'Jede Feier wird im Vorgespräch individuell geplant – Musik, Ablauf und Technik, passend zu euren Gästen und eurer Location.'

// Ein Wort, das beim Scrollen von gedämpft auf voll wechselt
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return <motion.span style={{ opacity }}>{children} </motion.span>
}

export default function ScrollWords() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')

  return (
    <section className="section bg-ink">
      <div className="container-page flex justify-center">
        <p ref={ref} className="max-w-[26ch] text-center font-display text-4xl font-normal leading-heading text-on-primary [text-wrap:balance]">
          {reduce
            ? text
            : words.map((w, i) => {
                const start = i / words.length
                const end = (i + 1) / words.length
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, end]}>
                    {w}
                  </Word>
                )
              })}
        </p>
      </div>
    </section>
  )
}
