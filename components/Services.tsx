// Leistungen als Kapitel: jedes Feld eine Farbe, eine Aussage, ein kurzer Text
const fields = [
  {
    phrase: 'Hochzeiten',
    text: 'Ein Hochzeitskonzept, individuell geplant und perfekt umgesetzt. Von einem Hochzeit-Experten mit Tanzausbildung und Wedding Award Gewinner 2022.',
    bg: 'var(--primary-600)',
    fg: 'var(--paper)',
    className: 'bg-primary-600 text-paper',
  },
  {
    phrase: 'Firmenfeiern',
    text: 'Musik passend zur Firmenkultur, damit für jeden Geschmack etwas dabei ist. Als DJ allein oder mit eigener Ton- und Lichtanlage.',
    bg: 'var(--paper-2)',
    fg: 'var(--ink)',
    className: 'bg-paper-2 text-ink',
  },
  {
    phrase: 'Partys & Events',
    text: 'Geburtstage, private Feiern und Veranstaltungen in Duisburg und Umgebung. DJ Mixing mit Club Feeling.',
    bg: 'var(--ink)',
    fg: 'var(--paper)',
    className: 'bg-ink text-paper',
  },
  {
    phrase: 'Licht & Ton',
    text: 'Nur den DJ buchen oder Full Service mit Ton- und Lichtanlage: Sound & Light mit dem gewissen Etwas.',
    bg: 'var(--primary-100)',
    fg: 'var(--ink)',
    className: 'bg-primary-100 text-ink',
  },
]

export default function Services() {
  return (
    <section id="leistungen" aria-label="Leistungen">
      {fields.map((f, i) => {
        const mirror = i % 2 === 1
        const Heading = i === 0 ? 'h2' : 'h3'
        return (
          <div
            key={f.phrase}
            data-bg={f.bg}
            data-fg={f.fg}
            className={`chapter flex min-h-[64svh] flex-col md:min-h-[76svh] ${f.className}`}
          >
            <div className="container-page flex flex-1 flex-col justify-between gap-8 py-7 md:gap-x-3 md:grid md:grid-cols-12 md:py-8">
              <p
                className={`max-w-[34ch] text-lg md:row-start-1 md:self-start ${
                  mirror ? 'text-right md:col-span-4 md:col-start-2 md:text-left' : 'md:col-span-4 md:col-start-8'
                }`}
              >
                {f.text}
              </p>
              <Heading
                className={`font-display text-title font-semibold uppercase leading-[0.9] tracking-[-0.02em] md:col-span-12 md:row-start-2 md:self-end ${
                  mirror ? 'md:text-right' : ''
                }`}
              >
                {f.phrase}
              </Heading>
            </div>
          </div>
        )
      })}
    </section>
  )
}
