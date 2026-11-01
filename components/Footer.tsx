import { nav, site } from '@/lib/site'

export default function Footer() {
  const year = new Date().getFullYear()
  const { social, address } = site.contact

  return (
    <footer className="bg-dark text-on-primary-muted">
      <div className="container-page grid gap-7 pb-24 pt-9 md:grid-cols-[1fr_auto] md:items-end md:pb-9">
        <div className="flex flex-col gap-4">
          <p className="text-4xl font-bold tracking-tight text-on-primary">{site.companyName}</p>
          <p className="max-w-measure text-sm">
            {site.legalEntity} · {address.street}, {address.zip} {address.city}
          </p>
          <p className="text-xs">
            © {year} {site.companyName}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors duration-fast hover:text-on-primary">
              {item.label}
            </a>
          ))}
          <a href={social.instagram} target="_blank" rel="noreferrer" className="transition-colors duration-fast hover:text-on-primary">
            Instagram
          </a>
          <a href={social.facebook} target="_blank" rel="noreferrer" className="transition-colors duration-fast hover:text-on-primary">
            Facebook
          </a>
          <a href="https://www.djakki.de/8/impressum.html" className="transition-colors duration-fast hover:text-on-primary">
            Impressum
          </a>
          <a href="https://www.djakki.de/7/datenschutz.html" className="transition-colors duration-fast hover:text-on-primary">
            Datenschutz
          </a>
        </nav>
      </div>
    </footer>
  )
}
