import Image from 'next/image'
import CascadeTitle from '@/components/CascadeTitle'
import { photos, venues } from '@/lib/site'

// Kachelbrett: Slogan, Herkunft aus dem Club Plastique, Porträt – darunter der Text über Akki und die Orte, an denen er auflegt
export default function Intro() {
  return (
    <section id="ueber" data-bg="var(--paper)" data-fg="var(--ink)" className="chapter bg-paper py-10">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-12 md:grid-rows-[38svh_38svh]">
          <CascadeTitle
            text="30 Jahre am Pult"
            className="col-span-2 flex min-h-[46svh] items-end bg-ink p-4 text-paper md:col-span-8 md:row-span-2 md:min-h-0 md:p-5"
          />

          <div className="flex aspect-square flex-col justify-between bg-paper-2 p-4 text-ink md:col-span-4 md:aspect-auto md:p-5">
            <p className="text-lg">Bekannt aus dem legendären</p>
            <p className="font-display text-xl font-semibold uppercase sm:text-2xl md:text-3xl lg:text-4xl">Club Plastique</p>
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

        <div className="mt-9 grid gap-5 md:grid-cols-12">
          <h2 className="text-4xl md:col-span-5">Über DJ Akki</h2>
          <p className="text-lg md:col-span-6 md:col-start-7">
            Axel Weyand ist als DJ Akki seit über 30 Jahren einer der bekanntesten DJs in Duisburg, bekannt aus dem
            legendären Club Plastique. Er mixt aktuelle Housetunes und Partyclassics, dazu Charts, 70er, 80er, 90er und
            Schlager, immer mit einem Ziel: das passende Lied zum passenden Zeitpunkt. Unterwegs ist er in Duisburg, Moers,
            Krefeld, auf Anfrage aber auch in ganz Deutschland.
          </p>
        </div>

        <ul
          aria-label="Fotos von Auftritten"
          className="-mx-3 mt-9 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 [scrollbar-width:thin] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0"
        >
          {venues.map((v) => (
            <li key={v.caption} className="w-[72vw] shrink-0 snap-start md:w-auto">
              <div className="relative aspect-[3/2] overflow-hidden bg-ink">
                <Image src={v.src} alt={v.caption} fill sizes="(min-width: 768px) 25vw, 72vw" className="object-cover grayscale" />
              </div>
              <p className="mt-2">{v.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
