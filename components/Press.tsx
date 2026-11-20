import Image from 'next/image'
import { press } from '@/lib/site'

const date = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })

// Pressestimmen direkt unter den Kundenstimmen und gleich aufgebaut: links die Überschrift,
// rechts die Artikel mit kleinem Bild und Überschrift, beides verlinkt auf den Artikel
export default function Press() {
  if (press.length === 0) return null

  return (
    <section
      id="presse"
      aria-labelledby="presse-titel"
      data-bg="var(--paper)"
      data-fg="var(--ink)"
      className="chapter bg-paper py-10 text-ink"
    >
      <div className="container-page grid gap-8 md:grid-cols-12 md:gap-5">
        <div className="flex flex-col gap-4 md:col-span-4">
          <h2 id="presse-titel" className="text-4xl">
            Pressestimmen
          </h2>
          <p className="text-lg">Was die Lokalpresse über DJ Akki und seine Partys schreibt.</p>
        </div>

        <ul className="md:col-span-7 md:col-start-6">
          {press.map((p, i) => (
            <li key={p.url} data-reveal style={{ '--i': i } as React.CSSProperties} className="border-t border-paper-2">
              <a href={p.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-4">
                <div className="relative aspect-[16/9] w-[112px] shrink-0 overflow-hidden bg-ink sm:w-[160px]">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-card group-hover:scale-[1.04]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm uppercase tracking-label text-ink-2">
                    {p.outlet}, {date.format(new Date(p.date))}
                  </p>
                  <p className="mt-1 font-display text-2xl font-medium decoration-1 underline-offset-4 group-hover:underline">
                    {p.title}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
