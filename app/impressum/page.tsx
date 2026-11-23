import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
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
    <LegalLayout title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>{postal}</p>

      <h2>Kontakt</h2>
      <p>
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

      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
        <br />
        {VAT_ID}
      </p>

      <h2>Redaktionell verantwortlich</h2>
      <p>{postal}</p>

      <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
    </LegalLayout>
  )
}
