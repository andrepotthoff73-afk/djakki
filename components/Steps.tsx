import Image from 'next/image'
import { photos } from '@/lib/site'

// Ablauf: vier gleich große Bildkacheln, die Reihenfolge steckt in den Titeln
const steps = [
  {
    title: 'Erst anfragen',
    text: 'Datum, Anlass und Ort per Formular, Telefon oder WhatsApp schicken.',
    photo: photos.phone,
  },
  {
    title: 'Dann besprechen',
    text: 'Im Vorgespräch geht es um Ablauf, Lieblingsgenres und Musikwünsche.',
    photo: photos.crate,
  },
  {
    title: 'Technik wählen',
    text: 'Nur DJ-Booking oder Full Service mit Ton- und Lichtanlage.',
    photo: photos.decks,
  },
  {
    title: 'Zuletzt feiern',
    text: 'Das passende Lied zum passenden Zeitpunkt, bis zum Schluss.',
    photo: photos.party,
  },
]

export default function Steps() {
  return (
    <section id="ablauf" data-bg="var(--paper)" data-fg="var(--ink)" className="chapter bg-paper py-10">
      <div className="container-page">
        <h2 className="text-4xl">So läuft eine Buchung</h2>

        <ol className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ '--i': i } as React.CSSProperties} className="flex flex-col">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
                <Image
                  src={s.photo.src}
                  alt={s.photo.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover grayscale"
                />
              </div>
              <h3 className="mt-4">{s.title}</h3>
              <p className="mt-2 max-w-[32ch]">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
