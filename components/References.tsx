import { references } from '@/lib/site'

// Referenzen als Auszug: links die Clubs der 90er, rechts Firmen und Locations, jeweils alphabetisch
export default function References() {
  return (
    <section id="referenzen" data-bg="var(--ink)" data-fg="var(--paper)" className="chapter bg-ink py-10 text-paper">
      <div className="container-page">
        <h2 className="text-4xl">Referenzen</h2>
        <p className="mt-4 max-w-[44ch] text-lg text-gray-400">Ein Auszug aus über 30 Jahren am Pult.</p>

        <div className="mt-8 grid gap-9 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-5">
            <h3 className="uppercase">Clubs &amp; Discotheken</h3>
            <p className="mt-1 text-sm text-gray-400">1990 bis 2000</p>
            <ul className="mt-5">
              {references.clubs.map((c) => (
                <li key={c.name} className="flex items-baseline justify-between gap-4 border-t border-ink-2 py-3">
                  <span className="font-display text-3xl font-medium">{c.name}</span>
                  <span className="shrink-0 text-gray-400">{c.city}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <h3 className="uppercase">Firmenevents &amp; DJ Booking</h3>
            <ul className="mt-5 sm:columns-2 sm:gap-5">
              {references.companies.map((name) => (
                <li key={name} className="break-inside-avoid border-t border-ink-2 py-3 text-lg">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
