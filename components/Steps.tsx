import Image from 'next/image'
import { photos } from '@/lib/site'

// Ablauf: vier Kacheln, jede größer als die vorige – die Reihenfolge steckt in der Größe
const steps = [
  {
    title: 'Erst anfragen',
    text: 'Datum, Anlass und Ort per Formular, Telefon oder WhatsApp schicken.',
    photo: photos.phone,
    tile: 'bg-accent-500',
    span: 'md:col-span-2 md:h-[26vh]',
  },
  {
    title: 'Dann besprechen',
    text: 'Im Vorgespräch geht es um Ablauf, Lieblingsgenres und Musikwünsche.',
    photo: photos.crate,
    tile: 'bg-primary-100',
    span: 'md:col-span-3 md:h-[36vh]',
  },
  {
    title: 'Technik wählen',
    text: 'Nur DJ-Booking oder Full Service mit Ton- und Lichtanlage.',
    photo: photos.decks,
    tile: 'bg-ink',
    span: 'md:col-span-3 md:h-[46vh]',
  },
  {
    title: 'Zuletzt feiern',
    text: 'Das passende Lied zum passenden Zeitpunkt, bis zum Schluss.',
    photo: photos.crowd,
    tile: 'bg-primary-600',
    span: 'md:col-span-4 md:h-[58vh]',
  },
]

const heights = ['h-[34vw]', 'h-[46vw]', 'h-[54vw]', 'h-[62vw]']

export default function Steps() {
  return (
    <section id="ablauf" data-bg="var(--paper)" data-fg="var(--ink)" className="chapter bg-paper py-10">
      <div className="container-page relative">
        <h2 data-reveal className="text-4xl md:absolute md:left-5 md:top-0 md:w-5/12 lg:left-6">
          So läuft eine Buchung
        </h2>

        <ol className="mt-6 grid gap-6 md:mt-0 md:grid-cols-12 md:items-end md:gap-2">
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ '--i': i } as React.CSSProperties} className={`flex flex-col ${s.span.split(' ')[0]}`}>
              <div className={`relative w-full overflow-hidden ${s.tile} ${heights[i]} ${s.span.split(' ')[1]}`}>
                <Image
                  src={s.photo.src}
                  alt={s.photo.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover opacity-80 mix-blend-luminosity grayscale"
                />
              </div>
              <div className="md:h-[8.5rem]">
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-1 max-w-[32ch]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
