import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion, finePointer } from '../lib/gsap';
import { FLAVOURS } from '../lib/data';

/**
 * Flavour index — the classic Awwwards hover list with a floating preview
 * that chases the cursor. Falls back to inline thumbs on touch.
 */
export default function FlavourIndex() {
  const root = useRef(null);
  const previewRef = useRef(null);
  const imgRef = useRef(null);
  const [active, setActive] = useState(null);

  useGSAP(
    () => {
      gsap.from('.flavour-row', {
        y: 44,
        opacity: 0,
        duration: reducedMotion() ? 0.01 : 0.9,
        stagger: reducedMotion() ? 0 : 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.flavour-list', start: 'top 85%' },
      });
      if (reducedMotion() || !finePointer()) return;
      const preview = previewRef.current;
      const xTo = gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3.out' });
      const section = root.current;
      const onMove = (e) => {
        const r = section.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
      };
      section.addEventListener('mousemove', onMove);
      return () => section.removeEventListener('mousemove', onMove);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="flavours section-pad" id="flavours" aria-label="Flavour index">
      <div className="wrap">
        <header className="flavours-head">
          <p className="eyebrow">
            <span className="dot" /> 07 · Full menu
          </p>
          <h2 className="display">
            The flavour <em className="display-italic">index</em>
          </h2>
        </header>

        <ul className="flavour-list">
          {FLAVOURS.map((f, i) => (
            <li
              key={f.name}
              className={`flavour-row ${active === i ? 'is-active' : ''}`}
              onMouseEnter={() => {
                setActive(i);
                if (imgRef.current && imgRef.current.getAttribute('src') !== f.img) {
                  imgRef.current.src = f.img;
                }
              }}
              onMouseLeave={() => setActive(null)}
              data-cursor="Taste"
            >
              <span className="flavour-idx">{String(i + 1).padStart(2, '0')}</span>
              <img className="flavour-thumb" src={f.img} alt="" loading="lazy" aria-hidden="true" />
              <span className="flavour-name display">{f.name}</span>
              <span className="flavour-meta">{f.meta}</span>
              <span className="flavour-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div
        ref={previewRef}
        className={`flavour-preview ${active !== null ? 'is-visible' : ''}`}
        aria-hidden="true"
      >
        <img ref={imgRef} src={FLAVOURS[0].img} alt="" />
      </div>
    </section>
  );
}
