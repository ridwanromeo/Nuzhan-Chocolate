import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const STATUSES = ['tempering the couverture…', 'pouring the shells…', 'scattering pistachios…', 'polishing the bonbons…'];

/**
 * Loading state: brand arch fills like molten chocolate while a counter
 * runs to 100. Resolves on window load (with a safety cap).
 */
export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (done.current) return;
      done.current = true;
      setCount(100);
      window.setTimeout(onDone, 450);
    };

    const start = performance.now();
    const MIN_TIME = 2100;
    const MAX_TIME = 4500;
    let raf;

    const tick = (now) => {
      const elapsed = now - start;
      // Ease the counter toward 100 across MIN_TIME, hold near 97 until loaded
      const target = Math.min(97, Math.floor((elapsed / MIN_TIME) * 100));
      setCount((c) => Math.max(c, target));
      setStatus(Math.min(STATUSES.length - 1, Math.floor(elapsed / (MIN_TIME / STATUSES.length))));
      if (elapsed < MAX_TIME && !done.current) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const maybeFinish = () => {
      const elapsed = performance.now() - start;
      if (elapsed >= MIN_TIME) finish();
      else window.setTimeout(finish, MIN_TIME - elapsed);
    };

    if (document.readyState === 'complete') {
      const t = window.setTimeout(maybeFinish, 200);
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(t);
      };
    }
    window.addEventListener('load', maybeFinish, { once: true });
    const cap = window.setTimeout(finish, MAX_TIME);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', maybeFinish);
      window.clearTimeout(cap);
    };
  }, [onDone]);

  return (
    <motion.div
      className="preloader"
      role="status"
      aria-label="Loading Nuzhan Chocolate"
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="preloader-inner">
        <div className="preloader-mark">
          <svg viewBox="0 0 120 148" aria-hidden="true">
            <defs>
              <clipPath id="archclip">
                <path d="M12 136 V64 a48 48 0 0 1 96 0 V136 Z" />
              </clipPath>
            </defs>
            <path
              d="M12 136 V64 a48 48 0 0 1 96 0 V136 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <g clipPath="url(#archclip)">
              <motion.rect
                x="0"
                width="120"
                fill="#c98a3d"
                initial={{ y: 148, height: 0 }}
                animate={{ y: 148 - (148 * count) / 100, height: (148 * count) / 100 }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
              <motion.path
                d="M0,0 H120 V14 C110,14 108,26 100,26 C92,26 94,14 86,14 C78,14 78,30 70,30 C62,30 64,14 56,14 C48,14 50,24 42,24 C34,24 34,14 26,14 C18,14 20,28 12,28 C6,28 4,14 0,14 Z"
                fill="#c98a3d"
                initial={{ y: 148 }}
                animate={{ y: 134 - (134 * count) / 100 }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
            </g>
            <text x="60" y="112" textAnchor="middle" className="preloader-fa" fill="currentColor">
              نوژان
            </text>
          </svg>
        </div>
        <p className="preloader-word">NUZHAN</p>
        <p className="preloader-status" aria-live="polite">
          {STATUSES[status]}
        </p>
      </div>
      <div className="preloader-count display" aria-hidden="true">
        {count}
        <span>%</span>
      </div>
      <div className="preloader-bar" aria-hidden="true">
        <motion.div
          className="preloader-bar-fill"
          animate={{ scaleX: count / 100 }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
