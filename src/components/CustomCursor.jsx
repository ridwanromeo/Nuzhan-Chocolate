import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { finePointer } from '../lib/gsap';

/**
 * Custom cursor: caramel dot + trailing gold ring + contextual label.
 * Only mounts on fine pointers; native cursor is hidden via body.has-cursor.
 */
export default function CustomCursor() {
  const [enabled] = useState(() => finePointer());
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const ringRef = useRef(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add('has-cursor');
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target.closest?.('[data-cursor]');
      setLabel(target?.dataset.cursor || '');
      const interactive = e.target.closest?.('a, button, [role="button"]');
      ringRef.current?.classList.toggle('is-link', Boolean(interactive && !target));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className={`cursor-dot ${pressed ? 'is-pressed' : ''} ${visible ? '' : 'is-hidden'}`}
        style={{ x, y }}
        aria-hidden="true"
      />
      <motion.div
        ref={ringRef}
        className={`cursor-ring ${label ? 'has-label' : ''} ${pressed ? 'is-pressed' : ''} ${
          visible ? '' : 'is-hidden'
        }`}
        style={{ x: ringX, y: ringY }}
        aria-hidden="true"
      >
        {label ? <span className="cursor-label">{label}</span> : null}
      </motion.div>
    </>
  );
}
