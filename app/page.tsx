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
import MobileCta from '@/components/MobileCta'

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
        <section aria-label="Anlässe und Musikrichtungen" className="bg-primary-600 py-5 text-on-primary">
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
      <MobileCta />
    </>
  )
}
