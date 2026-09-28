import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/** Brand mark shown while media loads or when it fails. */
function MediaMark({ label }) {
  return (
    <div className="media-mark" aria-hidden="true">
      <svg viewBox="0 0 64 76" className="media-mark-svg">
        <path
          d="M6 70 V34 a26 26 0 0 1 52 0 V70 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M18 34 c0-4 3-4 3-7.5 C21 23 25 23 25 26.5 c0 2.5 3.5 2 3.5 5.5 0 2 1.5 2.5 3.5 2.5 s3.5-.5 3.5-2.5 c0-3.5 3.5-3 3.5-5.5 0-3.5 4-3.5 4 0 0 3 2 3 3 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          className="media-mark-drip"
        />
      </svg>
      {label ? <span className="media-mark-label">{label}</span> : null}
    </div>
  );
}

/**
 * Image with loading shimmer + animated error fallback.
 * The fallback is a designed state, never a broken-image icon.
 */
export function SmartImage({
  src,
  alt,
  className = '',
  eager = false,
  sizes,
  onLoad,
}) {
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setStatus('loading');
  }, [src]);

  return (
    <div className={`smart-media ${status} ${className}`} data-attempt={attempt}>
      {status === 'loading' && (
        <div className="media-shimmer" aria-hidden="true">
          <MediaMark />
        </div>
      )}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            className="media-fallback"
            role="img"
            aria-label={`${alt} — image unavailable`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="media-fallback-inner"
            >
              <MediaMark label="this treat melted away" />
              <button
                type="button"
                className="media-retry"
                onClick={() => {
                  setAttempt((a) => a + 1);
                  setStatus('loading');
                }}
              >
                Try again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {status !== 'error' && (
        <img
          key={attempt}
          src={attempt > 0 ? `${src}${src.includes('?') ? '&' : '?'}retry=${attempt}` : src}
          alt={alt}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : 'auto'}
          decoding="async"
          draggable="false"
          onLoad={(e) => {
            setStatus('ready');
            onLoad?.(e);
          }}
          onError={() => setStatus('error')}
        />
      )}
    </div>
  );
}

/**
 * Video with scroll-aware play/pause, click-to-toggle and poster fallback.
 */
export function SmartVideo({
  src,
  poster,
  title,
  className = '',
  label = 'Play film',
}) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            video.play().then(
              () => setPlaying(true),
              () => setPlaying(false),
            );
          } else {
            video.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: [0, 0.35, 0.7] },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [failed, src]);

  const toggle = useCallback(() => {
    const video = ref.current;
    if (!video || failed) return;
    if (video.paused) {
      video.play().then(
        () => setPlaying(true),
        () => {},
      );
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [failed]);

  return (
    <div
      className={`smart-media smart-video ${playing ? 'is-playing' : 'is-paused'} ${className}`}
      data-cursor={failed ? 'Still' : playing ? 'Pause' : label}
      onClick={toggle}
      role="button"
      tabIndex={0}
      aria-label={`${title} — ${playing ? 'pause' : 'play'} video`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
    >
      {failed ? (
        <div className="media-fallback is-static">
          <div className="media-fallback-inner">
            <MediaMark label="film unavailable — enjoy the still" />
          </div>
        </div>
      ) : (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          onError={() => setFailed(true)}
        />
      )}
      <span className={`video-state ${playing ? 'playing' : ''}`} aria-hidden="true">
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1.5" />
            <rect x="14" y="5" width="4" height="14" rx="1.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" />
          </svg>
        )}
      </span>
    </div>
  );
}
