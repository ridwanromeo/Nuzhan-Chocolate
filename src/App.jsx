import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, reducedMotion } from './lib/gsap';
import './styles/shell.css';
import './styles/sections.css';
import './styles/collections.css';
import './styles/closing.css';
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import SiteNav from './components/SiteNav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Story from './components/Story';
import Eclairs from './components/Eclairs';
import Tablets from './components/Tablets';
import Bonbons from './components/Bonbons';
import Pops from './components/Pops';
import Films from './components/Films';
import Gifts from './components/Gifts';
import FlavourIndex from './components/FlavourIndex';
import Order from './components/Order';
import Footer from './components/Footer';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);

  // Lenis smooth scroll, wired to ScrollTrigger. Skipped under reduced motion.
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('locked', !loaded);
  }, [loaded]);

  const handleLoaded = useCallback(() => {
    setLoaded(true);
    window.__lenis?.start();
    // Let the preloader exit play, then re-measure every trigger
    window.setTimeout(() => ScrollTrigger.refresh(), 950);
  }, []);

  // Re-measure once fonts and hero art settle
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <div className="grain">
      <ErrorBoundary>
        <CustomCursor />
        <AnimatePresence>{!loaded && <Preloader onDone={handleLoaded} />}</AnimatePresence>
        <SiteNav ready={loaded} />
        <main>
          <Hero active={loaded} />
          <div className="marquee-holder" aria-hidden="true">
            <Marquee
              variant="caramel"
              speed={24}
              items={[
                '68% dark couverture',
                'Handmade daily',
                'Royal pistachio',
                'Sour cherry',
                'Small batch',
                'Signature gift boxes',
                'Dipped strawberries',
                'Sea-salt caramel',
              ]}
            />
          </div>
          <Story />
          <Eclairs />
          <Tablets />
          <div className="marquee-holder" aria-hidden="true">
            <Marquee
              variant="ghost"
              tilt={false}
              speed={34}
              items={['Bonbons', 'Pralines', 'Chocopops', 'Éclairs', 'Tablets', 'Geo-hearts', 'Gift boxes']}
            />
          </div>
          <Bonbons />
          <Pops />
          <Films />
          <Gifts />
          <FlavourIndex />
          <Order />
        </main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}
