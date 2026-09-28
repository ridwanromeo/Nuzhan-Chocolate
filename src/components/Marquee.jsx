import { Fragment } from 'react';

/** Infinite ribbon marquee. Content is duplicated for a seamless loop. */
export default function Marquee({ items, variant = 'caramel', tilt = true, speed = 26 }) {
  const row = (hidden) => (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="marquee-item">{item}</span>
          <span className="marquee-star" aria-hidden="true">
            ✦
          </span>
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className={`marquee marquee-${variant} ${tilt ? 'is-tilted' : ''}`} role="presentation">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
