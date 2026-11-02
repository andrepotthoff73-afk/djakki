import Image from 'next/image'
import { photos, site } from '@/lib/site'

// Kachelbrett: Slogan, Auszeichnung, Porträt – darunter der Text über Akki
export default function Intro() {
  return (
    <section id="ueber" data-bg="var(--paper)" data-fg="var(--ink)" className="chapter bg-paper px-2 pb-10 pt-2">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-12 md:grid-rows-[38svh_38svh]">
        <div className="col-span-2 flex min-h-[46svh] items-end bg-ink p-4 text-paper md:col-span-8 md:row-span-2 md:min-h-0 md:p-5">
          <h2 data-reveal className="text-title font-semibold leading-[0.86]">
            30 Jahre am Pult
          </h2>
        </div>

        <div className="flex aspect-square flex-col justify-between bg-primary-100 p-4 text-ink md:col-span-4 md:aspect-auto md:p-5">
          <p data-reveal className="text-lg">Wedding Award Gewinner</p>
          <p data-reveal style={{ '--i': 1 } as React.CSSProperties} className="font-display text-title font-semibold leading-[0.86]">
            2022
          </p>
        </div>

        <div className="relative aspect-square overflow-hidden bg-ink md:col-span-4 md:aspect-auto">
          <Image
            src={photos.portrait.src}
            alt={photos.portrait.alt}
            fill
            sizes="(min-width: 768px) 33vw, 50vw"
            className="breathe object-cover object-[center_25%] grayscale"
          />
        </div>
      </div>

      <div className="mt-9 grid gap-5 px-2 md:grid-cols-12 md:px-4">
        <p data-reveal className="text-lg md:col-span-6 md:col-start-7">
          Axel Weyand ist als DJ Akki seit über 30 Jahren einer der bekanntesten DJs in Duisburg, bekannt aus dem
          legendären Club Plastique. Er mixt aktuelle Housetunes, R’n’B und Partyclassics, dazu Charts, 70er, 80er,
          90er und Schlager, immer mit einem Ziel: das passende Lied zum passenden Zeitpunkt. Aufgelegt hat er unter
          anderem in der Villa Rheinperle, im Bolero, im Club Raffelberg, im Coupé 1900 und im Gleis drei. Unterwegs ist
          er in {site.serviceArea.join(', ').replace(/, ([^,]*)$/, ' und $1')}.
        </p>
      </div>
    </section>
  )
}
