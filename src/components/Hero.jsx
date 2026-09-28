import { Suspense, lazy, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, splitChars, splitWords, reducedMotion } from '../lib/gsap';
import { SmartImage } from './SmartMedia';
import { Magnetic, scrollToId } from './SiteNav';
import '../styles/sections.css';

const CocoaDust = lazy(() => import('./CocoaDust'));

const STATS = [
  { value: '68%', label: 'Dark couverture, fully loaded' },
  { value: '12', label: 'Signature flavours & counting' },
  { value: '100%', label: 'Poured & finished by hand' },
];

export default function Hero({ active }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;

      // ——— Intro (plays once the preloader lifts) ———
      const titleChars = splitChars(root.current.querySelector('.hero-title'));
      const subWords = splitWords(root.current.querySelector('.hero-sub'));
      const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      intro
        .from('.hero-fa', { opacity: 0, scale: 1.12, duration: 1.6 }, 0)
        .from(titleChars, { yPercent: 118, rotate: 4, duration: 1.1, stagger: 0.045 }, 0.1)
        .from(subWords, { yPercent: 120, duration: 0.9, stagger: 0.06 }, 0.55)
        .fromTo(
          '.hero-arch .bezel-core',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 },
          0.35,
        )
        .from('.hero-arch img', { scale: 1.35, duration: 1.6 }, 0.35)
        .from('.hero-copy > *', { y: 34, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.8)
        .from('.hero-stat', { y: 26, opacity: 0, duration: 0.8, stagger: 0.09 }, 1.0)
        .from('.hero-badge', { scale: 0, rotate: -120, duration: 1.1, ease: 'back.out(1.4)' }, 1.0)
        .from('.scroll-cue', { opacity: 0, y: 14, duration: 0.7 }, 1.25);

      if (active) intro.play();

      // ——— Scroll parallax (scrubbed, all transform-only) ———
      gsap.to('.hero-title', {
        yPercent: -24,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-arch', {
        y: 130,
        rotate: 3,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-fa', {
        yPercent: 34,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-copy', {
        y: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: '30% top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-badge', {
        rotate: 160,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="hero" id="top" aria-label="Nuzhan Chocolate — intro">
      <Suspense fallback={null}>
        <CocoaDust className="hero-dust" />
      </Suspense>
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-fa fa-mark" aria-hidden="true">
        نوژان
      </div>

      <div className="wrap hero-grid">
        <p className="hero-kicker">
          <span className="live-dot" aria-hidden="true" />
          Handmade chocolate atelier
        </p>
        <h1 className="display hero-title">NUZHAN</h1>
        <p className="display display-italic hero-sub">chocolate, made by hand & heart.</p>

        <figure className="hero-arch bezel bezel-arch" data-cursor="Taste">
          <div className="bezel-core">
            <SmartImage
              src="/assets/img/photo-filled-sticks.jpg"
              alt="Handmade gianduja-filled chocolate sticks, cut open"
              eager
            />
          </div>
          <figcaption className="sr-only">Gianduja-filled chocolate sticks</figcaption>
        </figure>

        <div className="hero-badge" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <defs>
              <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            </defs>
            <text>
              <textPath href="#badge-circle">SMALL BATCH · 68% CACAO · HANDMADE ·</textPath>
            </text>
            <path
              d="M48 78 V58 a12 12 0 0 1 24 0 V78 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="hero-copy">
          <p>
            Small-batch bars, jewel-box bonbons and gift boxes — poured slowly, scattered generously,
            and finished by hand in our atelier.
          </p>
          <div className="hero-ctas">
            <Magnetic>
              <button type="button" className="btn" onClick={() => scrollToId('#eclairs')}>
                <span>Taste the collection</span>
                <span className="btn-orb" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 5v14m0 0 6-6m-6 6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" className="btn btn-ghost" onClick={() => scrollToId('#films')}>
                <span>Watch the craft</span>
              </button>
            </Magnetic>
          </div>
        </div>

        <dl className="hero-stats">
          {STATS.map((s) => (
            <div className="hero-stat" key={s.label}>
              <dt className="display">{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          className="scroll-cue"
          onClick={() => scrollToId('#story')}
          aria-label="Scroll to our craft"
        >
          <span className="scroll-cue-line" aria-hidden="true">
            <span className="scroll-cue-drop" />
          </span>
          scroll to taste
        </button>
      </div>
    </section>
  );
}
