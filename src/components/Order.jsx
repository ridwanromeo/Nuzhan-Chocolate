import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap, reducedMotion } from '../lib/gsap';
import { CONTACT, FLAVOURS } from '../lib/data';
import { Magnetic } from './SiteNav';

const initial = { name: '', phone: '', product: FLAVOURS[0].name, note: '' };

export default function Order() {
  const root = useRef(null);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | success
  const [orderRef, setOrderRef] = useState('');

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('.order-info > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.order-grid', start: 'top 78%' },
      });
      gsap.from('.order-card', {
        y: 70,
        opacity: 0,
        rotate: 1.5,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.order-grid', start: 'top 72%' },
      });
    },
    { scope: root },
  );

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Tell us your name (2+ characters).';
    if (form.phone.replace(/\D/g, '').length < 7) er.phone = 'That phone number looks too short.';
    setErrors(er);
    if (Object.keys(er).length > 0) return;
    setState('sending');
    window.setTimeout(() => {
      setOrderRef(`NZ-${Math.floor(1000 + Math.random() * 9000)}`);
      setState('success');
    }, 1300);
  };

  const reset = () => {
    setForm(initial);
    setErrors({});
    setState('idle');
  };

  return (
    <section ref={root} className="order section-pad" id="order" aria-label="Order">
      <div className="wrap order-grid">
        <div className="order-info">
          <p className="eyebrow">
            <span className="dot" /> 08 · Order
          </p>
          <h2 className="display">
            Get your <em className="display-italic">box</em>
          </h2>
          <p className="order-lede">
            Fresh batches leave the atelier every week. Send a request and we&apos;ll confirm your
            mix personally — or just say hello.
          </p>
          <div className="order-contacts">
            <a
              className="order-contact"
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer"
              data-cursor="Follow"
            >
              <span className="oc-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span>
                <strong>Instagram</strong>
                <small>{CONTACT.instagramHandle}</small>
              </span>
            </a>
            <a className="order-contact" href={CONTACT.phoneHref} data-cursor="Call">
              <span className="oc-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path
                    d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <strong>Phone</strong>
                <small>{CONTACT.phoneDisplay}</small>
              </span>
            </a>
          </div>
          <p className="order-note">Prefer talking? Call afternoons — the couverture smells best then.</p>
        </div>

        <div className="order-card bezel">
          <div className="bezel-core order-card-inner">
            <AnimatePresence mode="wait">
              {state === 'success' ? (
                <motion.div
                  key="success"
                  className="order-success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.svg
                    viewBox="0 0 64 64"
                    className="success-check"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  >
                    <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="3" />
                    <motion.path
                      d="M21 33.5 28.5 41 44 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
                    />
                  </motion.svg>
                  <h3 className="display">Request received!</h3>
                  <p>
                    Order <strong>{orderRef}</strong> is in the queue. We&apos;ll confirm your mix
                    shortly on Instagram or by phone.
                  </p>
                  <button type="button" className="media-retry" onClick={reset}>
                    Make another request
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -14 }}
                >
                  <label className="field">
                    <span>Your name</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="e.g. Sara Ahmadi"
                      value={form.name}
                      onChange={set('name')}
                      className={errors.name ? 'is-invalid' : ''}
                      aria-invalid={Boolean(errors.name)}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.small
                          className="field-error"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {errors.name}
                        </motion.small>
                      )}
                    </AnimatePresence>
                  </label>
                  <label className="field">
                    <span>Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="09__ ___ ____"
                      value={form.phone}
                      onChange={set('phone')}
                      className={errors.phone ? 'is-invalid' : ''}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.small
                          className="field-error"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {errors.phone}
                        </motion.small>
                      )}
                    </AnimatePresence>
                  </label>
                  <label className="field">
                    <span>Craving</span>
                    <select name="product" value={form.product} onChange={set('product')}>
                      {FLAVOURS.map((f) => (
                        <option key={f.name} value={f.name}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Note <em>(optional)</em></span>
                    <textarea
                      name="note"
                      rows="3"
                      placeholder="Gift wrap? Extra dark? Tell us…"
                      value={form.note}
                      onChange={set('note')}
                    />
                  </label>
                  <Magnetic strength={0.15}>
                    <button
                      type="submit"
                      className={`btn btn-dark order-submit ${state === 'sending' ? 'is-sending' : ''}`}
                      disabled={state === 'sending'}
                      data-cursor="Send"
                    >
                      <span>{state === 'sending' ? 'Wrapping…' : 'Send request'}</span>
                      <span className="btn-orb" aria-hidden="true">
                        {state === 'sending' ? (
                          <span className="spinner" />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
