import Image from 'next/image'
import { listUpcoming } from '@/lib/eventStore'
import { formats, photos, ticketShop } from '@/lib/site'

const day = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })

// Events: nächste Termine als Flyer (gepflegt im Adminbereich) mit Weg zum Ticketshop, darunter Akkis eigene Eventformate
export default async function Events() {
  const upcoming = await listUpcoming()

  return (
    <section id="events" data-bg="var(--paper)" data-fg="var(--ink)" className="chapter overflow-x-clip bg-paper py-10">
      <div className="container-page">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="text-4xl">Events</h2>
          <a href={ticketShop} target="_blank" rel="noreferrer" className="btn btn-red w-full md:w-auto">
            Zum Ticketshop
          </a>
        </div>

        <h3 className="mt-8 uppercase">Nächste öffentliche Veranstaltungen</h3>
        {upcoming.length > 0 ? (
          <ul className="mt-5 grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
            {upcoming.map((e, i) => (
              <li key={e.id} data-reveal style={{ '--i': i } as React.CSSProperties}>
                <a href={e.ticket ?? ticketShop} target="_blank" rel="noreferrer" className="group flex flex-col">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
                    <Image
                      src={e.flyer}
                      alt={`Flyer: ${e.title}`}
                      fill
                      sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-card group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="mt-4 text-sm uppercase tracking-label">{day.format(new Date(e.date))}</p>
                  <p className="mt-1 font-display text-2xl font-medium">{e.title}</p>
                  <span className="link mt-2 self-start">Tickets</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 max-w-[48ch] text-lg">
            Die nächsten Termine mit allen Infos und Tickets stehen im{' '}
            <a href={ticketShop} target="_blank" rel="noreferrer" className="link">
              Ticketshop
            </a>
            .
          </p>
        )}

        <div className="mt-9 grid gap-8 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-5">
            <h3 className="uppercase">Eigene Eventformate</h3>
            <ul className="mt-5">
              {formats.map((f) => (
                <li key={f.name} className="flex items-baseline justify-between gap-4 border-t border-paper-2 py-3">
                  {f.href ? (
                    <a href={f.href} target="_blank" rel="noreferrer" className="link font-display text-3xl font-medium decoration-transparent hover:decoration-current">
                      {f.name}
                    </a>
                  ) : (
                    <span className="font-display text-3xl font-medium">{f.name}</span>
                  )}
                  {f.note && <span className="shrink-0 text-sm text-ink-2">{f.note}</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Die Fotos gleiten wie das Hero-Foto von rechts herein, kurz nacheinander; ausgelöst vom Raster als Ganzem,
              weil die Fotos selbst anfangs außerhalb des Bildschirms liegen */}
          <div data-reveal className="slide-group grid grid-cols-2 gap-3 md:col-span-6 md:col-start-7">
            {[photos.plastique, photos.rosenmontag, photos.summer].map((p, i) => (
              <div
                key={p.src}
                style={{ '--i': i } as React.CSSProperties}
                className={`slide-item relative overflow-hidden bg-ink ${i === 2 ? 'col-span-2 aspect-[16/7]' : 'aspect-[4/5]'}`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover grayscale"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
