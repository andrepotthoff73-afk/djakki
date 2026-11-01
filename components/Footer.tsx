import { nav, site } from '@/lib/site'

export default function Footer() {
  const year = new Date().getFullYear()
  const { social, address } = site.contact

  return (
    <footer className="bg-dark text-on-primary-muted">
      <div className="container-page grid gap-6 py-7 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xl font-bold text-on-primary">{site.companyName}</p>
          <p className="mt-2 text-sm">
            {site.legalEntity} · {address.street}, {address.zip} {address.city}
          </p>
          <p className="mt-4 text-xs">© {year} {site.companyName}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
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
