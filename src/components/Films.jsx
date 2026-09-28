import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion } from '../lib/gsap';
import { FILMS } from '../lib/data';
import { SmartVideo } from './SmartMedia';

export default function Films() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.films-head > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.films-head', start: 'top 82%' },
      });
      gsap.from('.film-panel', {
        y: 90,
        opacity: 0,
        scale: 0.96,
        duration: 1.1,
        stagger: 0.14,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.film-wall', start: 'top 80%' },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="films section-pad" id="films" aria-label="Craft films">
      <div className="wrap">
        <header className="films-head">
          <p className="eyebrow">
            <span className="dot" /> 05 · The films
          </p>
          <h2 className="display">
            Watch the <em className="display-italic">craft</em>
          </h2>
          <p className="films-lede">
            Shot inside the atelier — no sets, no doubles. Hover to lean in, tap to pause and drool.
          </p>
        </header>

        <div className="film-wall">
          {FILMS.map((f, i) => (
            <article className="film-panel bezel" key={f.src}>
              <div className="bezel-core">
                <SmartVideo src={f.src} poster={f.poster} title={f.title} label="Play film" />
                <div className="film-caption">
                  <span className="film-index">0{i + 1}</span>
                  <h3 className="display">{f.title}</h3>
                  <span className="film-time">{f.time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
