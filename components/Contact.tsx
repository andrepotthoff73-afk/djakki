'use client'

import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/site'
import { fadeUp, stagger } from '@/lib/motion'
import Reveal from './Reveal'
import { ChatIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from './Icons'

type Errors = Partial<Record<'name' | 'phone' | 'email', string>>

function Field({
  name,
  label,
  type = 'text',
  required = true,
  error,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
  error?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold">
        {label}
        {required && ' *'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className="h-input w-full rounded-md border border-border bg-bg px-3 text-base text-text transition-[border-color,box-shadow] duration-fast focus:border-primary-600 focus:outline-none focus:shadow-[0_0_0_3px_var(--primary-100)]"
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const reduce = useReducedMotion()
  const c = site.contact
  const [errors, setErrors] = useState<Errors>({})

  // Kein Backend: Die Anfrage öffnet eine vorausgefüllte E-Mail
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const next: Errors = {}
    if (!get('name')) next.name = 'Bitte gib deinen Namen an.'
    if (!get('phone')) next.phone = 'Bitte gib eine Telefonnummer an.'
    if (!/^\S+@\S+\.\S+$/.test(get('email'))) next.email = 'Bitte gib eine gültige E-Mail-Adresse an.'
    setErrors(next)
    if (Object.keys(next).length) return

    const body = [
      `Name: ${get('name')}`,
      `Telefon: ${get('phone')}`,
      `E-Mail: ${get('email')}`,
      `Datum: ${get('date') || '–'}`,
      '',
      get('message'),
    ].join('\n')
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent('DJ-Anfrage')}&body=${encodeURIComponent(body)}`
  }

  const contacts = [
    { icon: PhoneIcon, label: 'Telefon', value: c.phone, href: c.phoneHref },
    { icon: ChatIcon, label: 'WhatsApp', value: 'Nachricht schreiben', href: c.whatsapp, external: true },
    { icon: MailIcon, label: 'E-Mail', value: c.email, href: `mailto:${c.email}` },
  ]

  return (
    <section id="kontakt" className="section bg-surface">
      <div className="container-page grid gap-7 lg:grid-cols-[5fr_7fr] lg:gap-8">
        <div>
          <Reveal>
            <span className="eyebrow">Kontakt</span>
            <h2 className="text-3xl md:text-4xl [text-wrap:balance]">Termin frei? Lass uns sprechen.</h2>
            <p className="mt-3 max-w-measure text-lg text-muted">Unverbindlich anfragen – ich melde mich persönlich bei dir.</p>
          </Reveal>

          <motion.ul
            className="mt-6 grid gap-3"
            variants={reduce ? undefined : stagger}
            initial={reduce ? false : 'hidden'}
            whileInView={reduce ? undefined : 'show'}
            viewport={{ once: true, amount: 0.3 }}
          >
            {contacts.map((item) => (
              <motion.li key={item.label} variants={reduce ? undefined : fadeUp}>
                <motion.a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-lg bg-bg p-4 shadow-sm transition-shadow duration-card hover:shadow-md"
                  whileHover={reduce ? undefined : { x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="grid h-btn-md w-btn-md shrink-0 place-items-center rounded-md bg-primary-50 text-primary-600">
                    <item.icon width={24} height={24} />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-label text-muted">{item.label}</span>
                    <span className="block font-semibold group-hover:text-primary-600">{item.value}</span>
                  </span>
                </motion.a>
              </motion.li>
            ))}
            <motion.li variants={reduce ? undefined : fadeUp} className="flex items-start gap-4 rounded-lg bg-bg p-4 shadow-sm">
              <span className="grid h-btn-md w-btn-md shrink-0 place-items-center rounded-md bg-primary-50 text-primary-600">
                <PinIcon width={24} height={24} />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-label text-muted">Adresse</span>
                <span className="block font-semibold">
                  {c.address.street}, {c.address.zip} {c.address.city}
                </span>
              </span>
            </motion.li>
            <motion.li variants={reduce ? undefined : fadeUp} className="flex items-start gap-4 rounded-lg bg-bg p-4 shadow-sm">
              <span className="grid h-btn-md w-btn-md shrink-0 place-items-center rounded-md bg-primary-50 text-primary-600">
                <ClockIcon width={24} height={24} />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-label text-muted">Öffnungszeiten</span>
                <span className="block font-semibold">{c.openingHours ?? 'Termine nach Vereinbarung'}</span>
              </span>
            </motion.li>
          </motion.ul>
        </div>

        <Reveal delay={0.1}>
          <form className="grid gap-5 rounded-lg bg-bg p-5 shadow-md md:p-6" onSubmit={handleSubmit} noValidate>
            <Field name="name" label="Vorname, Name" error={errors.name} />
            <div className="grid gap-5 md:grid-cols-2">
              <Field name="phone" label="Telefonnummer" type="tel" error={errors.phone} />
              <Field name="email" label="E-Mail-Adresse" type="email" error={errors.email} />
            </div>
            <Field name="date" label="Datum der Veranstaltung" type="date" required={false} />
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-semibold">
                Nachricht
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-md border border-border bg-bg p-3 text-base transition-[border-color,box-shadow] duration-fast focus:border-primary-600 focus:outline-none focus:shadow-[0_0_0_3px_var(--primary-100)]"
              />
            </div>
            <p className="text-xs text-muted">
              Deine Daten werden ausschließlich zur Bearbeitung der Anfrage verwendet.{' '}
              <a href="https://www.djakki.de/7/datenschutz.html" className="underline underline-offset-4">
                Datenschutzerklärung
              </a>
            </p>
            <motion.button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Anfrage senden
            </motion.button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
