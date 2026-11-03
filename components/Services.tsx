// Leistungen in einem Kapitel: Hochzeiten als Kernleistung groß, die übrigen drei als Zeilen darunter
const wedding = {
  phrase: 'Hochzeiten',
  text: 'Ein Hochzeitskonzept, individuell geplant und perfekt umgesetzt. Von einem Hochzeit-Experten mit Tanzausbildung und Wedding Award Gewinner 2022.',
}

const others = [
  {
    phrase: 'Firmenfeiern',
    text: 'Musik passend zur Firmenkultur, damit für jeden Geschmack etwas dabei ist. Als DJ allein oder mit eigener Ton- und Lichtanlage.',
  },
  {
    phrase: 'Partys & Events',
    text: 'Geburtstage, private Feiern und Veranstaltungen in Duisburg und Umgebung. DJ Mixing mit Club Feeling.',
  },
  {
    phrase: 'Licht & Ton',
    text: 'Nur den DJ buchen oder Full Service mit Ton- und Lichtanlage: Sound & Light mit dem gewissen Etwas.',
  },
]

export default function Services() {
  return (
    <section id="leistungen" data-bg="var(--ink)" data-fg="var(--paper)" className="chapter bg-ink py-10 text-paper">
      <div className="container-page">
        <h2 className="text-4xl">Leistungen</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-12 md:items-end">
          <h3 className="text-title font-semibold uppercase md:col-span-7">{wedding.phrase}</h3>
          <p className="max-w-[40ch] text-lg md:col-span-4 md:col-start-9">{wedding.text}</p>
        </div>

        <ul className="mt-9 grid md:grid-cols-3 md:gap-5">
          {others.map((s) => (
            <li key={s.phrase} className="border-t border-ink-2 py-5">
              <h3 className="uppercase">{s.phrase}</h3>
              <p className="mt-3 max-w-[40ch]">{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
