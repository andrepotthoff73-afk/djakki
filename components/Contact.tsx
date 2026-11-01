'use client'

import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { site } from '@/lib/site'
import { fadeUp, stagger } from '@/lib/motion'
import Reveal from './Reveal'
import { ChatIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from './Icons'

type Errors = Partial<Record<'name' | 'phone' | 'email', string>>

const fieldClass =
  'w-full border-b border-paper bg-transparent py-3 text-base text-paper placeholder:text-on-primary-muted focus:border-b-2 focus:outline-none'

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
      <label htmlFor={name} className="mb-1 block text-xs font-semibold uppercase tracking-label text-on-primary-muted">
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
        className={fieldClass}
      />
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-on-primary-muted">
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
    <section id="kontakt" className="section bg-ink text-paper">
      <div className="container-page grid gap-20 lg:grid-cols-2 lg:gap-24">
        <div>
          <Reveal>
            <span className="eyebrow text-on-primary-muted">Kontakt</span>
            <h2 className="text-4xl md:text-title">
              Termin frei?
              <span className="block font-normal normal-case italic text-on-primary-muted">Lass uns sprechen.</span>
            </h2>
            <p className="mt-8 max-w-measure text-lg text-on-primary-muted">
              Unverbindlich anfragen – ich melde mich persönlich bei dir.
            </p>
          </Reveal>

          <motion.ul
            className="mt-14"
            variants={reduce ? undefined : stagger}
            initial={reduce ? false : 'hidden'}
            whileInView={reduce ? undefined : 'show'}
            viewport={{ once: true, amount: 0.3 }}
          >
            {contacts.map((item) => (
              <motion.li key={item.label} variants={reduce ? undefined : fadeUp} className="rule-light">
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="group flex items-center gap-6 py-6 transition-opacity duration-fast hover:opacity-70"
                >
                  <item.icon width={24} height={24} className="shrink-0" />
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-label text-on-primary-muted">{item.label}</span>
                    <span className="block font-display text-2xl">{item.value}</span>
                  </span>
                </a>
              </motion.li>
            ))}
            <motion.li variants={reduce ? undefined : fadeUp} className="rule-light flex items-center gap-6 py-6">
              <PinIcon width={24} height={24} className="shrink-0" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-label text-on-primary-muted">Adresse</span>
                <span className="block font-display text-2xl">
                  {c.address.street}, {c.address.zip} {c.address.city}
                </span>
              </span>
            </motion.li>
            <motion.li variants={reduce ? undefined : fadeUp} className="rule-light flex items-center gap-6 py-6">
              <ClockIcon width={24} height={24} className="shrink-0" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-label text-on-primary-muted">Öffnungszeiten</span>
                <span className="block font-display text-2xl">{c.openingHours ?? 'Termine nach Vereinbarung'}</span>
              </span>
            </motion.li>
          </motion.ul>
        </div>

        <Reveal delay={0.1}>
          <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
            <Field name="name" label="Vorname, Name" error={errors.name} />
            <div className="grid gap-8 md:grid-cols-2">
              <Field name="phone" label="Telefonnummer" type="tel" error={errors.phone} />
              <Field name="email" label="E-Mail-Adresse" type="email" error={errors.email} />
            </div>
            <Field name="date" label="Datum der Veranstaltung" type="date" required={false} />
            <div>
              <label htmlFor="message" className="mb-1 block text-xs font-semibold uppercase tracking-label text-on-primary-muted">
                Nachricht
              </label>
              <textarea id="message" name="message" rows={4} className={`${fieldClass} resize-none`} />
            </div>
            <p className="text-xs text-on-primary-muted">
              Deine Daten werden ausschließlich zur Bearbeitung der Anfrage verwendet.{' '}
              <a href="https://www.djakki.de/7/datenschutz.html" className="underline underline-offset-4">
                Datenschutzerklärung
              </a>
            </p>
            <button type="submit" className="btn btn-light btn-lg w-full">
              Anfrage senden
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
