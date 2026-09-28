import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion, finePointer } from '../lib/gsap';
import { SmartImage } from './SmartMedia';

const CHIPS = ['Sea-salt caramel', 'Sour cherry', 'Pistachio praline', 'Espresso noir', 'Rose & raspberry', 'Blue lagoon'];

export default function Bonbons() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.bonbons-head > *', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.bonbons-head', start: 'top 80%' },
      });
      gsap.fromTo(
        '.bonbon-main .bezel-core',
        { clipPath: 'inset(18% 12% 18% 12% round 200px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 22px)',
          ease: 'none',
          scrollTrigger: { trigger: '.bonbon-stage', start: 'top 85%', end: 'top 30%', scrub: 0.8 },
        },
      );
      gsap.utils.toArray('.bonbon-float').forEach((el, i) => {
        gsap.to(el, {
          yPercent: i === 0 ? -26 : 22,
          rotate: i === 0 ? -7 : 6,
          ease: 'none',
          scrollTrigger: { trigger: '.bonbon-stage', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
      gsap.from('.bonbon-chip', {
        scale: 0.6,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: '.bonbon-chips', start: 'top 88%' },
      });

      // Magnetic 3D tilt on the main jewel box (fine pointers only)
      if (!finePointer()) return;
      const main = root.current.querySelector('.bonbon-main');
      const onMove = (e) => {
        const r = main.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -9;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 11;
        gsap.to(main, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.5, ease: 'power2.out' });
      };
      const onLeave = () => gsap.to(main, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      main.addEventListener('mousemove', onMove);
      main.addEventListener('mouseleave', onLeave);
      return () => {
        main.removeEventListener('mousemove', onMove);
        main.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bonbons section-pad" id="bonbons" aria-label="Atelier bonbons">
      <span className="spark s1" aria-hidden="true">✦</span>
      <span className="spark s2" aria-hidden="true">✦</span>
      <span className="spark s3" aria-hidden="true">✦</span>
      <div className="wrap">
        <header className="bonbons-head">
          <p className="eyebrow">
            <span className="dot" /> 03 · Atelier bonbons
          </p>
          <h2 className="display">
            Little <em className="display-italic">jewels</em>, hand-painted
          </h2>
          <p className="bonbons-lede">
            Glossy domes and sharp triangles in small jewel-box editions — coloured with cocoa
            butter, never with shortcuts.
          </p>
        </header>

        <div className="bonbon-stage">
          <figure className="bonbon-main bezel" data-cursor="Jewel box">
            <div className="bezel-core">
              <SmartImage src="/assets/img/still-bonbons-grid.jpg" alt="Assorted hand-painted bonbons in a jewel box" />
            </div>
          </figure>
          <figure className="bonbon-float f-top bezel" data-cursor="Placed by hand">
            <div className="bezel-core">
              <SmartImage src="/assets/img/still-bonbons-hand.jpg" alt="Gloved hand placing a bonbon into its cup" />
            </div>
          </figure>
          <figure className="bonbon-float f-bottom bezel" data-cursor="Praline box">
            <div className="bezel-core">
              <SmartImage src="/assets/img/photo-praline-boxes.jpg" alt="Gift boxes of pralines and mini bars" />
            </div>
          </figure>
        </div>

        <ul className="bonbon-chips" aria-label="Bonbon flavours">
          {CHIPS.map((c) => (
            <li className="bonbon-chip" key={c} data-cursor="Yum">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
