import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion } from '../lib/gsap';
import { CONTACT } from '../lib/data';
import { Magnetic, scrollToId } from './SiteNav';

export default function Footer() {
  const root = useRef(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.footer-giant', {
        yPercent: 34,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 78%' },
      });
      gsap.from('.footer-col', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.footer-grid', start: 'top 85%' },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="footer" aria-label="Footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <p className="display footer-word">
              Nuzhan <span className="fa-mark">نوژان</span>
            </p>
            <p>Handmade chocolate atelier — small batches, big feelings.</p>
          </div>
          <nav className="footer-col" aria-label="Explore">
            <p className="footer-title">Explore</p>
            <ul>
              {[
                ['Craft', '#story'],
                ['Éclairs', '#eclairs'],
                ['Tablets', '#tablets'],
                ['Bonbons', '#bonbons'],
                ['Films', '#films'],
                ['Flavours', '#flavours'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(href);
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-col">
            <p className="footer-title">Find us</p>
            <ul>
              <li>
                <a href={CONTACT.instagram} target="_blank" rel="noreferrer">
                  {CONTACT.instagramHandle}
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
              </li>
              <li className="footer-dim">Fresh batches weekly</li>
            </ul>
          </div>
          <div className="footer-col footer-top">
            <Magnetic>
              <button
                type="button"
                className="to-top"
                onClick={() => scrollToId('#top')}
                aria-label="Back to top"
                data-cursor="Up"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 19V5m0 0-6 6m6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Magnetic>
            <p className="footer-dim">Back to the top</p>
          </div>
        </div>

        <p className="display footer-giant" aria-hidden="true">
          NUZHAN
        </p>

        <div className="footer-base">
          <span>© {year} Nuzhan Chocolate. All rights reserved.</span>
          <span className="footer-dim">Poured, scattered & packed by hand.</span>
        </div>
      </div>
    </footer>
  );
}
