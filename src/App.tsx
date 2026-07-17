import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Process from './components/Process'
import Pricing from './components/Pricing'
import DemoPreview from './components/DemoPreview'
import TeamCards from './components/TeamCards'
import VisitCta from './components/VisitCta'
import Footer from './components/Footer'
import IntroOverlay from './components/IntroOverlay'

function App() {
  const [introActive, setIntroActive] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!introActive) return undefined;

    const timer = setTimeout(() => {
      setIntroActive(false);
    }, 2150);
    return () => clearTimeout(timer);
  }, [introActive]);

  return (
    <div className={introActive ? 'intro-active' : 'intro-done'}>
      {introActive && <IntroOverlay />}
      <Navbar />
      <main>
        <Hero introActive={introActive} />
        <Services />
        <Process />
        <Pricing />
        <DemoPreview />
        <TeamCards />
        <VisitCta />
      </main>
      <Footer />
    </div>
  )
}

export default App
