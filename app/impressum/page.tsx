import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Impressum – DJ Akki & Friends',
  description: 'Impressum von DJ Akki & Friends, Agentur Weyand, Moers.',
}

const VAT_ID = 'DE170740697'

// Impressum, übernommen von der bisherigen djakki.de mit neuer Adresse und aktueller Rechtsgrundlage (DDG statt TMG)
export default function Impressum() {
  const { address, phone, phoneHref, email } = site.contact
  const postal = (
    <>
      {site.legalEntity}
      <br />
      {address.street}
      <br />
      {address.zip} {address.city}
    </>
  )

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

      <article className="container-page max-w-measure py-9">
        <h1 className="text-4xl">Impressum</h1>

        <h2 className="mt-7 text-2xl">Angaben gemäß § 5 DDG</h2>
        <p className="mt-3">{postal}</p>

        <h2 className="mt-7 text-2xl">Kontakt</h2>
        <p className="mt-3">
          Telefon:{' '}
          <a href={phoneHref} className="link">
            {phone}
          </a>
          <br />
          E-Mail:{' '}
          <a href={`mailto:${email}`} className="link">
            {email}
          </a>
        </p>

        <h2 className="mt-7 text-2xl">Umsatzsteuer-ID</h2>
        <p className="mt-3">
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          <br />
          {VAT_ID}
        </p>

        <h2 className="mt-7 text-2xl">Redaktionell verantwortlich</h2>
        <p className="mt-3">{postal}</p>

        <h2 className="mt-7 text-2xl">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
        <p className="mt-3">
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </article>
    </main>
  )
}
