import Navbar from '@/components/Navbar'
import SpotlightCursor from '@/components/SpotlightCursor'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import PinnedServices from '@/components/PinnedServices'
import ScrollWords from '@/components/ScrollWords'
import SocialProof from '@/components/SocialProof'
import Booking from '@/components/Booking'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

const strip = [
  'Hochzeiten',
  'Firmenfeiern',
  'Private Feiern',
  'House',
  'R’n’B',
  'Partyclassics',
  'Charts',
  '70er',
  '80er',
  '90er',
  'Schlager',
]

export default function Home() {
  return (
    <>
      <SpotlightCursor />
      <Navbar />
      <main>
        <Hero />
        <section aria-label="Anlässe und Musikrichtungen" className="border-b border-border bg-bg py-4 text-text">
          <Marquee items={strip} speed={40} />
        </section>
        <PinnedServices />
        <ScrollWords />
        <SocialProof />
        <Booking />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
