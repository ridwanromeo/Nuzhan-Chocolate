import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: 'expo.out', duration: 1 });

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches;

/** Split an element's text into word spans for staggered reveals. Returns word nodes. */
export function splitWords(el) {
  if (!el || el.dataset.split === 'true') {
    return el ? Array.from(el.querySelectorAll('.w')) : [];
  }
  const text = el.textContent;
  el.textContent = '';
  el.dataset.split = 'true';
  const frag = document.createDocumentFragment();
  const words = [];
  text
    .split(/\s+/)
    .filter(Boolean)
    .forEach((word) => {
      const mask = document.createElement('span');
      mask.className = 'wmask';
      mask.setAttribute('aria-hidden', 'true');
      const w = document.createElement('span');
      w.className = 'w';
      w.textContent = word;
      mask.appendChild(w);
      frag.appendChild(mask);
      frag.appendChild(document.createTextNode(' '));
      words.push(w);
    });
  el.setAttribute('aria-label', text);
  el.appendChild(frag);
  return words;
}

/** Split into chars (for short display lines only). */
export function splitChars(el) {
  if (!el || el.dataset.split === 'true') {
    return el ? Array.from(el.querySelectorAll('.c')) : [];
  }
  const text = el.textContent;
  el.textContent = '';
  el.dataset.split = 'true';
  const frag = document.createDocumentFragment();
  const chars = [];
  Array.from(text).forEach((ch) => {
    const mask = document.createElement('span');
    mask.className = 'wmask';
    mask.setAttribute('aria-hidden', 'true');
    const c = document.createElement('span');
    c.className = 'c';
    c.textContent = ch === ' ' ? '\u00A0' : ch;
    mask.appendChild(c);
    frag.appendChild(mask);
    chars.push(c);
  });
  el.setAttribute('aria-label', text);
  el.appendChild(frag);
  return chars;
}

export { gsap, ScrollTrigger };
