import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import RecordIntro from '@/components/RecordIntro'
import './globals.css'

// next/font hostet beide Schriften selbst: kein Layout-Shift, kein externer Font-Request
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'], display: 'swap', variable: '--font-inter' })
const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'DJ Akki & Friends – Event-DJ für Hochzeiten & Firmenfeiern in Duisburg',
  description:
    'DJ Akki aus Duisburg: seit über 30 Jahren Event-DJ für Hochzeiten, Firmenfeiern und private Partys. Wedding Award Gewinner 2022. Jetzt Wunschtermin anfragen.',
  icons: { icon: 'https://www.djakki.de/assets/icons/favicon-32x32.png' },
}

export const viewport: Viewport = { themeColor: '#c42021' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Einblende-Animationen nur mit Script, sonst bleibt alles sichtbar */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Platten-Intro nur beim ersten Besuch und ohne „Bewegung reduzieren“; vor dem ersten Bild entschieden, damit nichts aufblitzt */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!localStorage.getItem('djakki-record-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('record-intro')}catch(e){}",
          }}
        />
      </head>
      <body>
        {children}
        <RecordIntro />
      </body>
    </html>
  )
}
