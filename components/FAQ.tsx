// Antworten nur mit Angaben von djakki.de
const faqs = [
  {
    q: 'Wie läuft eine Anfrage ab?',
    a: 'Du schickst Datum, Anlass und Ort per Formular, Telefon oder WhatsApp. Danach gibt es ein Vorgespräch zu Ablauf und Musikwünschen.',
  },
  {
    q: 'Was kostet ein DJ?',
    a: 'Preise stehen nicht fest im Netz, weil jede Feier anders ist. Preis und Termin bekommst du auf Anfrage.',
  },
  {
    q: 'Was ist im Full Service enthalten?',
    a: 'Neben dem DJ-Booking auch die Ton- und Lichtanlage. Alternativ buchst du nur den DJ.',
  },
  {
    q: 'In welchen Städten legst du auf?',
    a: 'Regelmäßig in Duisburg, Krefeld, Moers, Neukirchen-Vluyn und Rheinberg. Für andere Orte frag einfach an.',
  },
  {
    q: 'Welche Musik spielst du?',
    a: 'House, R’n’B und Partyclassics, dazu Charts, 70er, 80er, 90er und Schlager. Musikwünsche nehme ich im Vorgespräch auf.',
  },
  {
    q: 'Wer steckt hinter DJ Akki & Friends?',
    a: 'Axel Michael Weyand alias DJ Akki, mit der Agentur Weyand in Moers.',
  },
]

// Akkordeon aus gefüllten Kacheln, die Überschrift bleibt links stehen
export default function FAQ() {
  return (
    <section id="faq" data-bg="var(--paper-2)" data-fg="var(--ink)" className="chapter bg-paper-2 py-10">
      <div className="container-page grid gap-6 md:grid-cols-12 md:gap-5">
        <h2 data-reveal className="text-4xl md:sticky md:top-[120px] md:col-span-4 md:self-start">
          Häufige Fragen
        </h2>

        <div className="flex flex-col gap-2 md:col-span-8">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              name="faq"
              open={i === 0}
              data-reveal
              style={{ '--i': i } as React.CSSProperties}
              className="group bg-paper transition-colors duration-fast open:bg-accent-500 open:text-paper"
            >
              <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-5 px-4 py-3 text-xl font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-[3px] w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute left-0 top-1/2 h-[3px] w-4 -translate-y-1/2 rotate-90 bg-current transition-transform duration-card ease-out group-open:rotate-0" />
                </span>
              </summary>
              <p className="max-w-[52ch] px-4 pb-5 text-lg">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
