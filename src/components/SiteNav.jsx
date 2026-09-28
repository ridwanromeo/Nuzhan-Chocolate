import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { CONTACT } from '../lib/data';
import { reducedMotion, finePointer } from '../lib/gsap';

export function scrollToId(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

const LINKS = [
  { label: 'Craft', href: '#story' },
  { label: 'Collection', href: '#eclairs' },
  { label: 'Bonbons', href: '#bonbons' },
  { label: 'Films', href: '#films' },
  { label: 'Gifts', href: '#gifts' },
  { label: 'Flavours', href: '#flavours' },
];

export default function SiteNav({ ready }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 240 && y > prev && !open);
  });

  useEffect(() => {
    document.body.classList.toggle('locked', open);
    if (open) window.__lenis?.stop();
    else if (ready) window.__lenis?.start();
  }, [open, ready]);

  const go = (href) => {
    setOpen(false);
    // Wait a beat for the menu to close before gliding
    window.setTimeout(() => scrollToId(href), open ? 350 : 0);
  };

  return (
    <>
      <motion.header
        className={`site-nav ${hidden ? 'is-hidden' : ''}`}
        initial={{ y: -90, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      >
        <nav className="nav-island" aria-label="Primary">
          <a
            href="#top"
            className="nav-brand"
            onClick={(e) => {
              e.preventDefault();
              go('#top');
            }}
            aria-label="Nuzhan Chocolate — back to top"
          >
            <svg viewBox="0 0 64 76" aria-hidden="true">
              <path
                d="M6 70 V34 a26 26 0 0 1 52 0 V70 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M18 34 c0-4 3-4 3-7.5 C21 23 25 23 25 26.5 c0 2.5 3.5 2 3.5 5.5 0 2 1.5 2.5 3.5 2.5 s3.5-.5 3.5-2.5 c0-3.5 3.5-3 3.5-5.5 0-3.5 4-3.5 4 0 0 3 2 3 3 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span>NUZHAN</span>
            <span className="fa-mark">نوژان</span>
          </a>
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.href);
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn nav-order"
            onClick={() => go('#order')}
            data-cursor="Order"
          >
            <span>Order</span>
            <span className="btn-orb" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <button
            type="button"
            className={`nav-burger ${open ? 'open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="menu-inner">
              <ul className="menu-list">
                {[...LINKS, { label: 'Order', href: '#order' }].map((l, i) => (
                  <li key={l.href} className="menu-item">
                    <motion.a
                      href={l.href}
                      className="menu-link"
                      onClick={(e) => {
                        e.preventDefault();
                        go(l.href);
                      }}
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '40%', opacity: 0, transition: { duration: 0.2 } }}
                      transition={{
                        duration: reducedMotion() ? 0.01 : 0.7,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.06 + i * 0.055,
                      }}
                    >
                      <span className="idx">0{i + 1}</span>
                      {l.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.div
                className="menu-foot"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <span>
                  Instagram <a href={CONTACT.instagram} target="_blank" rel="noreferrer">{CONTACT.instagramHandle}</a>
                </span>
                <span>
                  Phone <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Magnetic({ children, strength = 0.28, className = '' }) {
  if (reducedMotion() || !finePointer()) return <span className={className}>{children}</span>;
  return (
    <span
      className={`magnetic ${className}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        e.currentTarget.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0px, 0px)';
      }}
    >
      {children}
    </span>
  );
}
