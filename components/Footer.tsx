import { nav, site } from '@/lib/site'

// Der Name als Konstruktion: jeder Buchstabe aus einem eigenen Farbblock ausgespart
const blocks = [
  { letter: 'A', bg: 'bg-accent-500', h: 'h-full', ink: 'text-paper' },
  { letter: 'K', bg: 'bg-paper-2', h: 'h-[84%]' },
  { letter: 'K', bg: 'bg-paper', h: 'h-[94%]' },
  { letter: 'I', bg: 'bg-accent-500', h: 'h-[78%]', ink: 'text-paper' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const { social, address } = site.contact

  return (
    <footer data-bg="var(--ink)" data-fg="var(--paper)" className="chapter bg-ink pb-6 pt-9 text-paper">
      <div className="container-page">
        <div aria-hidden className="flex h-[22svh] items-end gap-1 md:h-[34svh]">
          {blocks.map((b, i) => (
            <div
              key={i}
              data-reveal
              style={{ '--i': i } as React.CSSProperties}
              className={`flex flex-1 items-end justify-center overflow-hidden ${b.bg} ${b.h}`}
            >
              <span className={`translate-y-[16%] font-display text-[24vw] font-semibold leading-none md:text-[26svh] ${b.ink ?? 'text-ink'}`}>
                {b.letter}
              </span>
            </div>
          ))}
        </div>
        <p className="sr-only">{site.companyName}</p>

        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-12">
          <nav aria-label="Footer" className="flex flex-col gap-2 md:col-span-2">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="link decoration-transparent hover:decoration-current">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2 md:col-span-2">
            <a href={social.instagram} target="_blank" rel="noreferrer" className="link decoration-transparent hover:decoration-current">
              Instagram
            </a>
            <a href={social.facebook} target="_blank" rel="noreferrer" className="link decoration-transparent hover:decoration-current">
              Facebook
            </a>
            <a href="https://www.djakki.de/8/impressum.html" className="link decoration-transparent hover:decoration-current">
              Impressum
            </a>
            <a href="https://www.djakki.de/7/datenschutz.html" className="link decoration-transparent hover:decoration-current">
              Datenschutz
            </a>
          </div>
          <address className="col-span-2 flex flex-col gap-2 not-italic md:col-span-4 md:col-start-9">
            <span>{site.legalEntity}</span>
            <span>
              {address.street}, {address.zip} {address.city}
            </span>
            <a href={site.contact.phoneHref} className="link">
              {site.contact.phone}
            </a>
          </address>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-gray-400">
            © {year} {site.companyName}
          </p>
          <a href="#top" className="btn btn-sm btn-paper whitespace-nowrap">
            Nach oben
          </a>
        </div>
      </div>
    </footer>
  )
}
