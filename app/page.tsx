import Navbar from '@/components/Navbar'
import SpotlightCursor from '@/components/SpotlightCursor'
import Hero from '@/components/Hero'
import Intro from '@/components/Intro'
import Marquee from '@/components/Marquee'
import Services from '@/components/Services'
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
      <SpotlightCursor brightness={0.5} />
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <section aria-label="Anlässe und Musikrichtungen" className="rule py-8 text-ink">
          <Marquee items={strip} speed={45} />
        </section>
        <Services />
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
