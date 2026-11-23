import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import VideoIntro from '@/components/VideoIntro'
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
  title: 'DJ Akki & Friends – Event-DJ für Partys, Events & Firmenfeiern in Duisburg',
  description:
    'DJ Akki aus Duisburg: seit über 30 Jahren Event-DJ für Partys, Firmenfeiern, Events und Hochzeiten. Jetzt Wunschtermin anfragen.',
}

export const viewport: Viewport = { themeColor: '#c42021' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Einblende-Animationen nur mit Script, sonst bleibt alles sichtbar */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Video-Intro nur auf der Startseite und nur beim ersten Besuch, nicht bei „Bewegung reduzieren“ oder Datensparmodus; vor dem ersten Bild entschieden, damit nichts aufblitzt */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var c=navigator.connection;if(location.pathname==='/'&&!localStorage.getItem('djakki-video-intro')&&!(c&&c.saveData)&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('site-intro')}catch(e){}",
          }}
        />
      </head>
      <body>
        {children}
        <VideoIntro />
      </body>
    </html>
  )
}
