'use client'

import { useState, type FormEvent } from 'react'
import { site } from '@/lib/site'

const occasions = ['Hochzeit', 'Firmenfeier', 'Geburtstag', 'Veranstaltung']
const article: Record<string, string> = { Geburtstag: 'einen' }

const chip =
  'flex min-h-btn-sm cursor-pointer items-center px-4 transition-colors duration-fast bg-accent-600 text-paper hover:bg-accent-700 has-[:checked]:bg-paper has-[:checked]:text-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-paper'

const cell =
  'min-h-btn-lg w-full bg-accent-600 px-4 text-lg text-paper placeholder:text-accent-100 transition-colors duration-fast [color-scheme:dark] focus:bg-accent-700 focus:outline-none'

const contactLink = 'link inline-block py-2'

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
      data-bg="var(--accent-500)"
      data-fg="var(--paper)"
      className="chapter bg-accent-500 py-10 text-paper"
    >
      <div className="container-page">
        <h2 className="text-4xl">
          Wunschtermin anfragen
        </h2>
        <p className="mt-3 max-w-[48ch] text-lg">
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
          <fieldset>
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

          <fieldset>
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

          <div className="grid gap-4 md:grid-cols-3 md:items-end md:gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="datum" className="font-semibold">
                Datum
              </label>
              <input id="datum" name="datum" type="date" value={day} onChange={(e) => setDay(e.target.value)} className={cell} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ort" className="font-semibold">
                Ort
              </label>
              <input
                id="ort"
                name="ort"
                list="orte"
                placeholder="z. B. Duisburg"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className={cell}
              />
              <datalist id="orte">
                {site.serviceArea.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            </div>
            <button
              type="submit"
              aria-describedby="mail-hinweis"
              className="min-h-btn-lg bg-ink text-lg font-semibold text-paper transition-[background-color,transform] duration-fast hover:bg-ink-2 active:scale-[0.98]"
            >
              Anfrage per E-Mail
            </button>
          </div>
          <p id="mail-hinweis" className="-mt-2 md:text-right">
            Öffnet dein E-Mail-Programm mit der fertigen Nachricht.
          </p>
        </form>

        <div className="mt-6 grid gap-2 border-t border-accent-600 pt-4 md:grid-cols-3">
          <p>
            Lieber direkt?{' '}
            <a href={whatsapp} target="_blank" rel="noreferrer" className={contactLink}>
              Per WhatsApp schicken
            </a>
          </p>
          <p>
            Telefon:{' '}
            <a href={c.phoneHref} className={contactLink}>
              {c.phone}
            </a>
          </p>
          <p className="md:text-right">
            <a href={`mailto:${c.email}`} className={contactLink}>
              {c.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
