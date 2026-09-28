import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion } from '../lib/gsap';
import { TABLETS } from '../lib/data';
import { SmartImage } from './SmartMedia';

const CACAO = [68, 68, 58, 62];

export default function Tablets() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const cards = gsap.utils.toArray('.tablet-card');
      cards.forEach((card, i) => {
        gsap.from(card.querySelector('.tablet-media'), {
          clipPath: 'inset(12% 8% 12% 8% round 24px)',
          opacity: 0.4,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: card, start: 'top 78%' },
        });
        const fill = card.querySelector('.meter-fill');
        if (fill) {
          gsap.fromTo(
            fill,
            { scaleX: 0 },
            {
              scaleX: CACAO[i] / 100,
              duration: 1.4,
              ease: 'expo.out',
              scrollTrigger: { trigger: card, start: 'top 70%' },
            },
          );
        }
        // Stack effect: previous card shrinks + dims as the next arrives
        if (i < cards.length - 1) {
          gsap.to(card.querySelector('.tablet-inner'), {
            scale: 0.93,
            opacity: 0.55,
            filter: 'brightness(0.7)',
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: 'top top+=140',
              scrub: true,
            },
          });
        }
      });
      gsap.from('.tablets-head > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.tablets-head', start: 'top 82%' },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="tablets section-pad" id="tablets" aria-label="Loaded tablets">
      <div className="wrap">
        <header className="tablets-head">
          <p className="eyebrow">
            <span className="dot" /> 02 · Loaded tablets
          </p>
          <h2 className="display">
            Slabs that <em className="display-italic">bury the lede</em>
          </h2>
          <p className="tablets-lede">
            Thick couverture bases drowned under whole roasted nuts and freeze-dried fruit. Break a
            corner — hear that snap.
          </p>
        </header>

        <div className="tablet-stack">
          {TABLETS.map((t, i) => (
            <article
              className={`tablet-card ${i % 2 ? 'flip' : ''}`}
              key={t.name}
              style={{ '--accent': t.accent, '--stack-top': `${104 + i * 22}px` }}
              data-cursor="Break off"
            >
              <div className="tablet-inner bezel">
                <div className="bezel-core tablet-grid">
                  <div className="tablet-media">
                    <SmartImage src={t.img} alt={t.name} />
                  </div>
                  <div className="tablet-body">
                    <span className="tablet-index">No.{i + 1}</span>
                    <h3 className="display">{t.name}</h3>
                    <p>{t.desc}</p>
                    <div className="meter" role="img" aria-label={`Cacao intensity ${CACAO[i]} percent`}>
                      <div className="meter-track">
                        <div className="meter-fill" />
                      </div>
                      <span className="meter-label">{CACAO[i]}% cacao</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
