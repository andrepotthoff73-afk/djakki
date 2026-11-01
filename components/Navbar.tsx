'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { nav, site } from '@/lib/site'
import { ease } from '@/lib/motion'
import { CloseIcon, MenuIcon, PhoneIcon } from './Icons'

const contact = site.contact

export default function Navbar() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  // Über dem dunklen Hero transparent, danach weiß mit Schatten
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  // Menü mit Escape schließen
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-card ${
        scrolled ? 'bg-bg shadow-md' : 'bg-transparent'
      }`}
      initial={reduce ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="container-page flex min-h-8 items-center justify-between gap-3">
        <a href="#top" aria-label={`${site.companyName} – zum Seitenanfang`} className="shrink-0">
          <Image src={site.logoUrl} alt={site.companyName} width={48} height={48} unoptimized priority />
        </a>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex gap-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`group relative py-2 text-sm font-semibold transition-colors duration-fast ${
                    scrolled ? 'text-muted hover:text-primary-600' : 'text-on-primary-muted hover:text-on-primary'
                  }`}
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current transition-transform duration-card group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={contact.phoneHref} className="btn btn-primary btn-sm" aria-label={`Anrufen: ${contact.phone}`}>
            <PhoneIcon width={20} height={20} />
            <span className="hidden md:inline">{contact.phone}</span>
            <span className="md:hidden">Anrufen</span>
          </a>
          <button
            type="button"
            className={`btn btn-ghost btn-sm lg:hidden ${scrolled ? '' : 'text-on-primary'}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile Navigation"
            className="overflow-hidden border-t border-border bg-bg lg:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <ul className="container-page py-3">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3, ease }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-btn-md items-center border-b border-border text-base font-semibold text-text"
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
