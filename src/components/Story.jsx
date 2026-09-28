import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, splitWords, reducedMotion } from '../lib/gsap';
import { SmartImage } from './SmartMedia';

const STATEMENT =
  'We melt couverture in small copper batches, pour every shell by hand, and bury it under the best nuts and berries we can find. Nothing rushed. Nothing artificial. Just chocolate with a pulse.';

const FACTS = [
  { value: 68, suffix: '%', label: 'dark couverture in our signature slabs' },
  { value: 8, suffix: '', label: 'loaded tablet recipes in the core menu' },
  { value: 100, suffix: '%', label: 'hand-poured, hand-packed, hand-delivered' },
];

export default function Story() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const words = splitWords(root.current.querySelector('.story-statement'));
      gsap.fromTo(
        words,
        { opacity: 0.14, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: '.story-statement',
            start: 'top 78%',
            end: 'bottom 42%',
            scrub: 0.6,
          },
        },
      );
      gsap.utils.toArray('.story-fig').forEach((fig, i) => {
        gsap.from(fig, {
          y: 90,
          opacity: 0,
          rotate: i === 0 ? -4 : 4,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: fig, start: 'top 88%' },
        });
        gsap.to(fig.querySelector('img'), {
          yPercent: i === 0 ? -10 : 10,
          ease: 'none',
          scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      gsap.utils.toArray('.fact-num').forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: () => {
            el.firstChild.textContent = Math.round(obj.v);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="story section-pad" id="story" aria-label="Our craft">
      <div className="wrap">
        <p className="eyebrow story-eyebrow">
          <span className="dot" /> Our craft
        </p>
        <p className="display story-statement">{STATEMENT}</p>
        <p className="story-fa fa-mark" aria-hidden="true">
          دست‌ساز با عشق — handmade with love
        </p>

        <div className="story-media">
          <figure className="story-fig bezel bezel-arch" data-cursor="Atelier">
            <div className="bezel-core">
              <SmartImage
                src="/assets/img/still-packing-place.jpg"
                alt="Hands placing colourful handmade chocolate bars into a gift box"
              />
            </div>
            <figcaption>Every bar, placed by hand</figcaption>
          </figure>
          <figure className="story-fig bezel" data-cursor="Gifting">
            <div className="bezel-core">
              <SmartImage
                src="/assets/img/photo-giftbox-trio.jpg"
                alt="Signature trio gift box with pistachio, hazelnut and cranberry bars"
              />
            </div>
            <figcaption>The signature trio box</figcaption>
          </figure>
        </div>

        <dl className="facts">
          {FACTS.map((f) => (
            <div className="fact" key={f.label}>
              <dt className="display fact-num" data-value={f.value}>
                <span>0</span>
                {f.suffix}
              </dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
