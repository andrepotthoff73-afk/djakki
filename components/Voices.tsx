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
    <section id="stimmen" aria-labelledby="stimmen-titel" className="grid md:min-h-[78svh] md:grid-cols-12">
      <div
        data-bg="var(--primary-600)"
        data-fg="var(--paper)"
        className="chapter order-1 flex flex-col bg-primary-600 px-3 pb-8 pt-8 text-paper md:order-2 md:col-span-7 md:px-6 md:pt-10"
      >
        <h2 id="stimmen-titel" className="sr-only">
          Kundenstimmen
        </h2>
        <blockquote key={active} className="max-w-[30ch] font-display text-3xl font-medium leading-[1.2]">
          <p className="-indent-[0.4em]">„{r.text}“</p>
        </blockquote>
      </div>

      <div
        data-bg="var(--ink)"
        data-fg="var(--paper)"
        className="chapter order-2 flex flex-col justify-end gap-5 bg-ink px-3 py-6 text-paper md:order-1 md:col-span-5 md:px-6 md:py-7"
      >
        <p className="text-lg">5 von 5 Sternen auf djakki.de</p>
        <div role="group" aria-label="Kundenstimme wählen" className="flex flex-col gap-2">
          {items.map((it, i) => (
            <button
              key={it.author}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`flex min-h-btn-md flex-col items-start justify-center gap-1 px-4 py-2 text-left md:flex-row md:items-center md:justify-between md:gap-4 transition-colors duration-fast ${
                i === active ? 'bg-paper text-ink' : 'bg-ink-2 text-paper hover:bg-primary-800'
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
    </section>
  )
}
