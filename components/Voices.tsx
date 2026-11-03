'use client'

import { useState } from 'react'
import { site } from '@/lib/site'

const date = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })

// Die drei echten Kundenstimmen von djakki.de: links wer, rechts was
export default function Voices() {
  const items = site.reviews.items
  const [active, setActive] = useState(0)
  const r = items[active]

  return (
    <section
      id="stimmen"
      aria-labelledby="stimmen-titel"
      data-bg="var(--paper-2)"
      data-fg="var(--ink)"
      className="chapter bg-paper-2 py-10 text-ink"
    >
      <div className="container-page grid gap-8 md:grid-cols-12 md:gap-5">
        <div className="flex flex-col gap-6 md:col-span-7 md:col-start-6 md:row-start-1">
          <h2 id="stimmen-titel" className="text-4xl">
            Kundenstimmen
          </h2>
          <blockquote key={active} className="max-w-[30ch] font-display text-3xl font-medium leading-lead">
            <p className="-indent-[0.4em]">„{r.text}“</p>
          </blockquote>
        </div>

        <div className="flex flex-col justify-end gap-4 md:col-span-4 md:row-start-1">
        <p className="text-lg">5 von 5 Sternen auf djakki.de</p>
        <div role="group" aria-label="Kundenstimme wählen" className="flex flex-col gap-2">
          {items.map((it, i) => (
            <button
              key={it.author}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`flex min-h-btn-md flex-col items-start justify-center gap-1 px-4 py-2 text-left transition-colors duration-fast ${
                i === active ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-white'
              }`}
            >
              <span className="whitespace-nowrap text-lg font-semibold">{it.author}</span>
              <span>
                {it.event}, {date.format(new Date(it.date))}
              </span>
            </button>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
