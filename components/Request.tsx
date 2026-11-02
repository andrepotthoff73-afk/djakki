'use client'

import Image from 'next/image'
import { useState, type FormEvent } from 'react'
import { site, strip } from '@/lib/site'

const occasions = ['Hochzeit', 'Firmenfeier', 'Geburtstag', 'Veranstaltung']
const article: Record<string, string> = { Geburtstag: 'einen' }

const chip =
  'flex min-h-btn-sm cursor-pointer items-center px-4 transition-colors duration-fast bg-primary-700 text-paper hover:bg-primary-800 has-[:checked]:bg-paper has-[:checked]:text-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-paper'

const cell =
  'min-h-[60px] w-full bg-primary-700 px-4 text-center text-lg text-paper placeholder:text-primary-200 transition-colors duration-fast focus:bg-primary-500 focus:outline-none md:min-h-[96px]'

// Anfrage als Plattenkiste: Anlass und Musik antippen, daraus wird die Nachricht
export default function Request() {
  const c = site.contact
  const [occasion, setOccasion] = useState('Hochzeit')
  const [genres, setGenres] = useState<string[]>([])
  const [day, setDay] = useState('')
  const [place, setPlace] = useState('')

  const when = day ? ` am ${new Date(day).toLocaleDateString('de-DE')}` : ''
  const where = place ? ` in ${place}` : ''
  const subject = `Anfrage: ${occasion}${when}`
  const body = [
    'Hallo Akki,',
    '',
    `wir planen ${article[occasion] ?? 'eine'} ${occasion}${when}${where}.`,
    genres.length ? `In die Plattenkiste gehören: ${genres.join(', ')}.` : '',
    '',
    'Bist du an dem Tag noch frei?',
  ]
    .filter((line, i) => line || i !== 3)
    .join('\n')

  const mailto = `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const whatsapp = `${c.whatsapp}?text=${encodeURIComponent(body)}`

  function toggle(g: string) {
    setGenres((list) => (list.includes(g) ? list.filter((x) => x !== g) : [...list, g]))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    window.location.href = mailto
  }

  return (
    <section
      id="kontakt"
      data-bg="var(--primary-600)"
      data-fg="var(--paper)"
      className="chapter overflow-hidden bg-primary-600 pb-9 pt-10 text-paper"
    >
      <div className="overflow-x-auto md:overflow-hidden" aria-label="Fotos von Auftritten">
        <ul className="drift flex w-max gap-2">
          {[...strip, ...strip].map((p, i) => (
            <li key={i} aria-hidden={i >= strip.length} className="shrink-0">
              <div className="relative h-[110px] overflow-hidden md:h-[150px]" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                <Image src={p.src} alt={p.caption} fill sizes="240px" className="object-cover" />
              </div>
              <p className="mt-2 text-primary-200">{p.caption}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-page mt-8">
        <h2 data-reveal className="text-4xl">
          Wunschtermin anfragen
        </h2>
        <p data-reveal style={{ '--i': 1 } as React.CSSProperties} className="mt-3 max-w-[48ch] text-lg">
          Pack deine Plattenkiste: Anlass und Musik antippen, Datum und Ort eintragen. Daraus wird deine Anfrage, Preise
          gibt es dann persönlich.
        </p>

        <form
          action={`mailto:${c.email}`}
          method="post"
          encType="text/plain"
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-5"
        >
          <fieldset data-reveal style={{ '--i': 2 } as React.CSSProperties}>
            <legend className="mb-3 text-lg font-semibold">Anlass</legend>
            <div className="flex flex-wrap gap-2">
              {occasions.map((o) => (
                <label key={o} className={chip}>
                  <input
                    type="radio"
                    name="anlass"
                    value={o}
                    checked={occasion === o}
                    onChange={() => setOccasion(o)}
                    className="sr-only"
                  />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset data-reveal style={{ '--i': 3 } as React.CSSProperties}>
            <legend className="mb-3 text-lg font-semibold">Musik</legend>
            <div className="flex flex-wrap gap-2">
              {site.musicGenres.map((g) => (
                <label key={g} className={chip}>
                  <input
                    type="checkbox"
                    name="musik"
                    value={g}
                    checked={genres.includes(g)}
                    onChange={() => toggle(g)}
                    className="sr-only"
                  />
                  {g}
                </label>
              ))}
            </div>
          </fieldset>

          <div data-reveal style={{ '--i': 4 } as React.CSSProperties} className="grid gap-2 md:grid-cols-3">
            <label className="sr-only" htmlFor="datum">
              Datum
            </label>
            <input id="datum" name="datum" type="date" value={day} onChange={(e) => setDay(e.target.value)} className={cell} />
            <label className="sr-only" htmlFor="ort">
              Ort
            </label>
            <input
              id="ort"
              name="ort"
              list="orte"
              placeholder="Ort, z. B. Duisburg"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className={cell}
            />
            <datalist id="orte">
              {site.serviceArea.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
            <button
              type="submit"
              className="min-h-[60px] bg-paper text-lg font-semibold text-ink transition-[background-color,transform] duration-fast hover:bg-white active:scale-[0.98] md:min-h-[96px]"
            >
              Anfrage per E-Mail
            </button>
          </div>
        </form>

        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <p>
            Lieber direkt?{' '}
            <a href={whatsapp} target="_blank" rel="noreferrer" className="link">
              Per WhatsApp schicken
            </a>
          </p>
          <p>
            Telefon:{' '}
            <a href={c.phoneHref} className="link">
              {c.phone}
            </a>
          </p>
          <p className="md:text-right">
            <a href={`mailto:${c.email}`} className="link">
              {c.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
