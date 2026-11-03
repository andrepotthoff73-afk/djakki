import Image from 'next/image'
import { photos } from '@/lib/site'

// Erstes Kapitel: ein rotes Feld, der Name in zwei Tinten, darunter die volle Tanzfläche in Rot getönt
export default function Hero() {
  return (
    <section
      id="top"
      data-bg="var(--accent-500)"
      data-fg="var(--paper)"
      className="chapter flex min-h-svh flex-col bg-accent-500"
    >
      <div className="container-page flex flex-1 flex-col gap-5 pb-6 pt-9 md:pb-7 md:pt-10">
        <h1 className="text-display font-semibold">
          <span data-reveal className="block text-paper">
            DJ Akki
          </span>
          <span data-reveal style={{ '--i': 1 } as React.CSSProperties} className="block text-ink">
            Duisburg
          </span>
        </h1>

        <div data-reveal style={{ '--i': 2 } as React.CSSProperties} className="relative min-h-[34svh] flex-1 overflow-hidden">
          <Image
            src={photos.crowd.src}
            alt={photos.crowd.alt}
            fill
            priority
            sizes="(min-width: 1280px) 1184px, 100vw"
            className="object-cover object-[center_40%] mix-blend-multiply grayscale"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-12 md:items-end">
          <p data-reveal style={{ '--i': 3 } as React.CSSProperties} className="max-w-[22ch] font-display text-3xl font-medium text-paper md:col-span-6">
            Seit über 30 Jahren am Pult. Wedding Award Gewinner 2022.
          </p>
          <div className="flex flex-col gap-4 md:col-span-6 md:items-end">
            <p data-reveal style={{ '--i': 4 } as React.CSSProperties} className="max-w-[34ch] text-lg text-paper md:text-right">
              Event-DJ für Hochzeiten, Firmenfeiern und private Partys in Duisburg und Umgebung.
            </p>
            <a data-reveal style={{ '--i': 5 } as React.CSSProperties} href="#kontakt" className="btn btn-ink w-full md:w-auto">
              Wunschtermin anfragen
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
