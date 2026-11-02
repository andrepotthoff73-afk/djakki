import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Intro from '@/components/Intro'
import Services from '@/components/Services'
import Voices from '@/components/Voices'
import Steps from '@/components/Steps'
import FAQ from '@/components/FAQ'
import Request from '@/components/Request'
import Footer from '@/components/Footer'
import RevealObserver from '@/components/RevealObserver'

// Die Seite als Folge von Farbkapiteln, die ohne Abstand aneinanderstoßen
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <Services />
        <Voices />
        <Steps />
        <FAQ />
        <Request />
      </main>
      <Footer />
      <RevealObserver />
    </>
  )
}
