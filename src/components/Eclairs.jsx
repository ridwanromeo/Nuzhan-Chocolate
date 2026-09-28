import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion } from '../lib/gsap';
import { ECLAIRS } from '../lib/data';
import { SmartImage } from './SmartMedia';
import '../styles/collections.css';

export default function Eclairs() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) {
        root.current.classList.add('is-static');
        return;
      }
      const mm = gsap.matchMedia();
      // Desktop: pinned horizontal journey
      mm.add('(min-width: 900px)', () => {
        const track = root.current.querySelector('.eclair-track');
        const bar = root.current.querySelector('.eclair-progress-fill');
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        // Inner-image drift synced to the horizontal movement
        gsap.utils.toArray('.eclair-card .smart-media img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: 'none',
              scrollTrigger: { trigger: img.closest('.eclair-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            },
          );
        });
      });
      // Mobile: gentle batch entrance, native vertical flow
      mm.add('(max-width: 899px)', () => {
        gsap.utils.toArray('.eclair-card').forEach((card, i) => {
          gsap.from(card, {
            y: 70,
            opacity: 0,
            rotate: i % 2 ? 2 : -2,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 90%' },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="eclairs" id="eclairs" aria-label="Éclair bars collection">
      <div className="eclair-pin">
        <div className="eclair-track">
          <header className="eclair-intro">
            <p className="eyebrow">
              <span className="dot" /> 01 · The icons
            </p>
            <h2 className="display">
              Éclair <em className="display-italic">bars</em>
            </h2>
            <p className="eclair-lede">
              Our signature silhouette — a glossy shell with a molten window of nuts, berries and
              caramel. Five moods, one obsession.
            </p>
            <p className="eclair-hint" aria-hidden="true">
              <span className="eclair-hint-arrow">→</span> keep scrolling, we travel sideways
            </p>
          </header>
          {ECLAIRS.map((e, i) => (
            <article className="eclair-card" key={e.name} data-cursor="Taste">
              <span className="eclair-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="bezel">
                <div className="bezel-core eclair-img">
                  <SmartImage src={e.img} alt={`${e.name} éclair bar`} />
                  <span className="eclair-tag">{e.tag}</span>
                </div>
              </div>
              <h3 className="display">{e.name}</h3>
              <p>{e.note}</p>
            </article>
          ))}
          <div className="eclair-outro">
            <p className="display display-italic">…and a sixth flavour, every season.</p>
          </div>
        </div>
        <div className="eclair-progress" aria-hidden="true">
          <div className="eclair-progress-fill" />
        </div>
      </div>
    </section>
  );
}
