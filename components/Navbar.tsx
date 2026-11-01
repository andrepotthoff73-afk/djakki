'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { nav, site } from '@/lib/site'
import { ease } from '@/lib/motion'
import { CloseIcon, MenuIcon, PhoneIcon } from './Icons'

const contact = site.contact

// Schwebende Glas-Leiste: liegt über jeder Sektion, Menü klappt darunter auf
export default function Navbar() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)

  // Menü mit Escape schließen
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.header
      className="fixed inset-x-0 top-3 z-50"
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="container-page">
        <div className="glass mx-auto flex items-center justify-between gap-3 rounded-full border border-neutral-800 py-2 pl-3 pr-2">
          <a href="#top" aria-label={`${site.companyName} – zum Seitenanfang`} className="shrink-0 pl-1">
            <Image src={site.logoUrl} alt={site.companyName} width={40} height={40} unoptimized priority />
          </a>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="flex gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block rounded-full px-4 py-2 text-sm font-semibold text-on-primary-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-on-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href={contact.phoneHref} className="btn btn-light btn-sm hidden md:inline-flex" aria-label={`Anrufen: ${contact.phone}`}>
              <PhoneIcon width={20} height={20} />
              {contact.phone}
            </a>
            <a href="#kontakt" className="btn btn-primary btn-sm hidden lg:inline-flex">
              Anfragen
            </a>
            <button
              type="button"
              className="grid h-btn-sm w-btn-sm place-items-center rounded-full text-on-primary hover:bg-neutral-800 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile Navigation"
            className="container-page mt-2 lg:hidden"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
          >
            <ul className="glass grid gap-1 rounded-2xl border border-neutral-800 p-2">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.25, ease }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-btn-md items-center rounded-xl px-4 text-base font-semibold text-on-primary hover:bg-neutral-800"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
