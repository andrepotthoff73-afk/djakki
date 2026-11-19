import Image from 'next/image'
import { press } from '@/lib/site'

const month = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })

// Pressestimmen: Scans der Zeitungsartikel, ein Klick öffnet den Artikel in voller Größe
export default function Press() {
  if (press.length === 0) return null

  return (
    <section id="presse" data-bg="var(--ink)" data-fg="var(--paper)" className="chapter bg-ink py-10 text-paper">
      <div className="container-page">
        <h2 className="text-4xl">Pressestimmen</h2>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
          {press.map((p, i) => (
            <li key={p.scan} data-reveal style={{ '--i': i } as React.CSSProperties}>
              <a href={p.scan} target="_blank" rel="noreferrer" className="group flex flex-col">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper-2">
                  <Image
                    src={p.scan}
                    alt={`Zeitungsartikel: ${p.title}`}
                    fill
                    sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-3 transition-transform duration-card group-hover:scale-[1.02]"
                  />
                </div>
                <p className="mt-4 text-sm uppercase tracking-label text-gray-400">
                  {p.outlet}, {month.format(new Date(p.date))}
                </p>
                <p className="mt-1 font-display text-2xl font-medium">{p.title}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
