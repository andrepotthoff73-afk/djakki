// Erstes Kapitel: ein rotes Feld, der Name in zwei Tinten, ein Satz unten rechts
export default function Hero() {
  return (
    <section
      id="top"
      data-bg="var(--accent-500)"
      data-fg="var(--paper)"
      className="chapter flex min-h-svh flex-col bg-accent-500"
    >
      <div className="container-page flex flex-1 flex-col pb-6 pt-[16svh] md:pb-7">
        <h1 className="text-display font-semibold leading-[0.82] tracking-[-0.03em]">
          <span data-reveal className="block text-paper">
            DJ Akki
          </span>
          <span data-reveal style={{ '--i': 1 } as React.CSSProperties} className="block text-ink">
            Duisburg
          </span>
        </h1>

        <div className="mt-auto flex flex-col gap-5 pt-8 md:items-end">
          <p data-reveal style={{ '--i': 3 } as React.CSSProperties} className="max-w-[30ch] text-lg text-paper md:text-right">
            Event-DJ für Hochzeiten, Firmenfeiern und private Partys. Seit über 30 Jahren in Duisburg und Umgebung.
          </p>
          <a data-reveal style={{ '--i': 4 } as React.CSSProperties} href="#kontakt" className="btn btn-ink w-full md:w-auto">
            Wunschtermin anfragen
          </a>
        </div>
      </div>
    </section>
  )
}
