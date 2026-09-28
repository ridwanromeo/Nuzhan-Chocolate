import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion } from '../lib/gsap';
import { SmartImage } from './SmartMedia';

const ROWS = [
  {
    img: '/assets/img/still-chocopop-held.jpg',
    alt: 'Chocopop on a stick with caramel drizzle and chopped nuts',
    sticker: 'kids love it',
    title: 'Chocopops on sticks',
    body: 'Fudgy centres dipped in dark, milk or ruby-style pink — striped, sprinkled and dangerously poppable.',
    tags: ['Caramel stripe', 'Nut crunch', 'Ruby pink'],
  },
  {
    img: '/assets/img/still-geohearts.jpg',
    alt: 'Geometric heart chocolates studded with pomegranate seeds',
    sticker: 'limited batch',
    title: 'Pomegranate geo-hearts',
    body: 'Faceted hearts set with jewel-bright pomegranate arils. Crisp shell, fresh burst, zero survivors.',
    tags: ['Dark noir', 'Blush pink', 'Gold white'],
  },
  {
    img: '/assets/img/still-strawberry-box.jpg',
    alt: 'Gift box of chocolate-dipped strawberries and chocopops',
    sticker: 'fresh daily',
    title: 'Dipped strawberries',
    body: 'Plump berries dunked to order and boxed with pops and hearts — the gift that never gets re-gifted.',
    tags: ['Dark dip', 'White dip', 'Party box'],
  },
];

export default function Pops() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.pops-head > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pops-head', start: 'top 82%' },
      });
      gsap.utils.toArray('.pop-row').forEach((row) => {
        const flip = row.classList.contains('flip');
        gsap.fromTo(
          row.querySelector('.pop-media'),
          { clipPath: flip ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: row, start: 'top 76%' },
          },
        );
        gsap.from(row.querySelectorAll('.pop-body > *'), {
          y: 44,
          opacity: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 72%' },
        });
        gsap.from(row.querySelector('.pop-sticker'), {
          scale: 0,
          rotate: -40,
          duration: 0.8,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: row, start: 'top 62%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="pops" id="pops" aria-label="Pops, hearts and berries">
      <svg className="pops-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,0 H1440 V45 C1330,85 1240,10 1130,40 C1020,70 950,85 840,45 C730,10 660,70 550,50 C440,30 370,80 260,55 C150,30 80,70 0,40 Z"
          fill="var(--cream)"
        />
      </svg>
      <div className="wrap section-pad">
        <header className="pops-head">
          <p className="eyebrow">
            <span className="dot" /> 04 · Playful side
          </p>
          <h2 className="display">
            Pops, hearts <em className="display-italic">& berries</em>
          </h2>
        </header>
        {ROWS.map((r, i) => (
          <article className={`pop-row ${i % 2 ? 'flip' : ''}`} key={r.title}>
            <div className="pop-media bezel" data-cursor="Take one">
              <div className="bezel-core">
                <SmartImage src={r.img} alt={r.alt} />
              </div>
              <span className="pop-sticker">{r.sticker}</span>
            </div>
            <div className="pop-body">
              <span className="pop-index">0{i + 1}</span>
              <h3 className="display">{r.title}</h3>
              <p>{r.body}</p>
              <ul className="pop-tags">
                {r.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
