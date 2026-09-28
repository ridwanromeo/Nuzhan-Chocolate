import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion } from '../lib/gsap';
import { SmartImage } from './SmartMedia';
import { Magnetic, scrollToId } from './SiteNav';

const STEPS = [
  { n: '01', title: 'Pick your mix', body: 'Éclairs, tablets, bonbons or pops — or trust us with a tasting selection.' },
  { n: '02', title: 'We hand-pack', body: 'Every piece is nested by hand in our blush signature box with the Nuzhan seal.' },
  { n: '03', title: 'Ribbon & tag', body: 'Satin ribbon, a hand-written tag, and optional seasonal sleeves — like our botanica edition.' },
  { n: '04', title: 'Delivered fresh', body: 'Same-week delivery so the snap, shine and berries arrive at their peak.' },
];

const SIZES = ['Trio box', '6 pieces', '12 pieces', 'Party & wedding'];

export default function Gifts() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.gifts-head > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.gifts-head', start: 'top 82%' },
      });
      gsap.utils.toArray('.gift-step').forEach((step) => {
        gsap.from(step, {
          x: 60,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 85%' },
        });
      });
      gsap.to('.gift-card-b', {
        y: -40,
        rotate: -4,
        ease: 'none',
        scrollTrigger: { trigger: '.gift-media', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="gifts section-pad" id="gifts" aria-label="Gift boxes">
      <div className="wrap">
        <header className="gifts-head">
          <p className="eyebrow">
            <span className="dot" /> 06 · Gifting
          </p>
          <h2 className="display">
            Boxed like <em className="display-italic">it matters</em>
          </h2>
        </header>

        <div className="gift-grid">
          <div className="gift-media">
            <figure className="gift-card-a bezel bezel-arch" data-cursor="Our seal">
              <div className="bezel-core">
                <SmartImage
                  src="/assets/img/still-packaging-box.jpg"
                  alt="Blush Nuzhan gift box with the handmade chocolate seal"
                />
              </div>
            </figure>
            <figure className="gift-card-b bezel" data-cursor="Botanica">
              <div className="bezel-core">
                <SmartImage
                  src="/assets/img/still-cacao-boxes.jpg"
                  alt="Cacao botanica gift boxes with colourful print"
                />
              </div>
            </figure>
            <figure className="gift-card-c bezel" data-cursor="With love">
              <div className="bezel-core">
                <SmartImage
                  src="/assets/img/still-gift-ribbon.jpg"
                  alt="Gift box tied with red ribbon and a greeting tag"
                />
              </div>
            </figure>
          </div>

          <div className="gift-steps">
            {STEPS.map((s) => (
              <div className="gift-step" key={s.n}>
                <span className="gift-n display">{s.n}</span>
                <div>
                  <h3 className="display">{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
            <ul className="gift-sizes" aria-label="Gift sizes">
              {SIZES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <Magnetic>
              <button type="button" className="btn btn-dark" onClick={() => scrollToId('#order')}>
                <span>Build my gift box</span>
                <span className="btn-orb" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
