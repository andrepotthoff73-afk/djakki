// Gemeinsamer Rahmen für Impressum und Datenschutz: schlichte Kopfzeile mit Weg zurück, Text in Lesebreite
export default function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-paper text-ink">
      <header className="container-page flex h-header items-center justify-between gap-5">
        <a href="/" className="flex items-center gap-3 font-display text-xl font-semibold uppercase leading-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/dj-akki-friends.png" alt="" width={44} height={44} className="h-[44px] w-[44px] rounded-full bg-paper" />
          DJ Akki
        </a>
        <a href="/" className="link">
          Zur Startseite
        </a>
      </header>

      <article className="legal container-page max-w-measure py-9">
        <h1 className="text-4xl">{title}</h1>
        {children}
      </article>

      <footer className="container-page flex gap-5 border-t border-paper-2 py-6 text-sm">
        <a href="/impressum" className="link">
          Impressum
        </a>
        <a href="/datenschutz" className="link">
          Datenschutz
        </a>
      </footer>
    </main>
  )
}
