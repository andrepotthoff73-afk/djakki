'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { nav, site } from '@/lib/site'
import { ease } from '@/lib/motion'
import { CloseIcon, MenuIcon } from './Icons'

// Transparent über dem Foto, nach dem Scrollen Papier mit feiner Linie. Menü öffnet als Vollbild.
export default function Navbar() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  // Menü: Scroll sperren, mit Escape schließen
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-card ${
          scrolled && !open ? 'border-b border-border bg-paper text-ink' : open ? 'text-paper' : 'text-paper'
        }`}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="container-page flex h-20 items-center justify-between">
          <a href="#top" aria-label={`${site.companyName} – zum Seitenanfang`}>
            <Image src={site.logoUrl} alt={site.companyName} width={44} height={44} unoptimized priority />
          </a>

          <div className="flex items-center gap-8">
            <nav aria-label="Hauptnavigation" className="hidden xl:block">
              <ul className="flex gap-8">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-xs font-semibold uppercase tracking-label transition-opacity duration-fast hover:opacity-60">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-label"
              aria-expanded={open}
              aria-controls="menu-overlay"
              onClick={() => setOpen(true)}
            >
              Menü
              <MenuIcon width={24} height={24} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            className="fixed inset-0 z-[60] flex flex-col bg-ink text-paper"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="container-page flex h-20 items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-label">Menü</span>
              <button
                type="button"
                className="flex items-center gap-3 text-xs font-semibold uppercase tracking-label"
                onClick={() => setOpen(false)}
                aria-label="Menü schließen"
              >
                Schließen
                <CloseIcon width={24} height={24} />
              </button>
            </div>

            <nav aria-label="Mobile Navigation" className="container-page flex flex-1 flex-col justify-center">
              <ul className="flex flex-col gap-2">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-6 font-display text-5xl italic leading-none md:text-title"
                    >
                      <span className="text-xs font-semibold not-italic uppercase tracking-label text-on-primary-muted">
                        0{i + 1}
                      </span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="container-page flex flex-col gap-2 pb-10 text-sm text-on-primary-muted md:flex-row md:justify-between">
              <a href={site.contact.phoneHref} className="text-paper">
                {site.contact.phone}
              </a>
              <a href={`mailto:${site.contact.email}`} className="text-paper">
                {site.contact.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
