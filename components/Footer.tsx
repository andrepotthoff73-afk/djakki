import { nav, site } from '@/lib/site'

// Ruhiger Abschluss: Name in Serife, Navigation und rechtliches in einer Zeile
export default function Footer() {
  const year = new Date().getFullYear()
  const { social, address } = site.contact

  return (
    <footer className="rule bg-bg">
      <div className="container-page flex flex-col items-center gap-12 py-20 text-center">
        <p className="font-display text-5xl font-normal uppercase leading-none md:text-title">{site.companyName}</p>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-xs font-semibold uppercase tracking-label">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition-opacity duration-fast hover:opacity-60">
              {item.label}
            </a>
          ))}
          <a href={social.instagram} target="_blank" rel="noreferrer" className="transition-opacity duration-fast hover:opacity-60">
            Instagram
          </a>
          <a href={social.facebook} target="_blank" rel="noreferrer" className="transition-opacity duration-fast hover:opacity-60">
            Facebook
          </a>
        </nav>

        <p className="text-sm text-muted">
          {site.legalEntity} · {address.street}, {address.zip} {address.city}
        </p>

        <p className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted">
          <span>© {year} {site.companyName}</span>
          <a href="https://www.djakki.de/8/impressum.html" className="underline underline-offset-4">
            Impressum
          </a>
          <a href="https://www.djakki.de/7/datenschutz.html" className="underline underline-offset-4">
            Datenschutz
          </a>
        </p>
      </div>
    </footer>
  )
}
