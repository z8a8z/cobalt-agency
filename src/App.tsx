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
import FloatingBot from './components/FloatingBot'
import PerformanceDashboard from './components/PerformanceDashboard'
import MaintenancePage from './components/MaintenancePage'
import { MAINTENANCE_MODE } from './config/site'

function App() {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />
  }

  return <LiveSite />
}

function LiveSite() {
  const [introActive, setIntroActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroActive(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
      <FloatingBot paused={introActive} />
      {import.meta.env.DEV && <PerformanceDashboard />}
    </div>
  )
}

export default App
