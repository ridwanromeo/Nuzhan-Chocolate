import React from 'react';
import { motion } from 'motion/react';
import '../styles/shell.css';

/**
 * Global error boundary with an animated "melted chocolate" fallback.
 * Any section crash becomes a branded moment instead of a white screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[Nuzhan] Render fault:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="error-fallback" role="alert">
        <motion.div
          className="error-drips"
          initial={{ y: '-102%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
            <path
              d="M0,0 H1440 V110 C1380,110 1360,170 1310,170 C1260,170 1270,110 1210,110 C1150,110 1150,200 1090,200 C1030,200 1040,110 980,110 C920,110 930,150 880,150 C830,150 830,110 770,110 C710,110 720,190 660,190 C600,190 610,110 550,110 C490,110 490,160 440,160 C390,160 390,110 330,110 C270,110 280,180 220,180 C160,180 170,110 110,110 C60,110 50,140 0,140 Z"
              fill="#c98a3d"
            />
          </svg>
        </motion.div>
        <motion.div
          className="error-card"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">
            <span className="dot" /> A little accident
          </p>
          <h1 className="display">The chocolate melted.</h1>
          <p>Something overheated on our side. Let&apos;s re-temper the page and try again.</p>
          <div className="error-actions">
            <button className="btn" type="button" onClick={() => window.location.reload()}>
              <span>Re-temper the page</span>
              <span className="btn-orb" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <a
              className="btn btn-ghost"
              href="https://instagram.com/nuzhan.chocolate"
              target="_blank"
              rel="noreferrer"
            >
              <span>Visit Instagram</span>
            </a>
          </div>
        </motion.div>
      </div>
    );
  }
}
