import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

const SLIDE_MS = 6500;

function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => window.matchMedia?.(query).matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return undefined;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function useDocumentHidden() {
  const [hidden, setHidden] = useState(() => document.hidden);
  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return hidden;
}

/**
 * Home page carousel. Advances on its own; each slide's progress line is a CSS
 * animation whose end moves to the next slide, so pausing the animation pauses
 * the carousel exactly where it is.
 */
export default function Hero({ slides }) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const hidden = useDocumentHidden();
  const pointerStart = useRef(null);
  const count = slides.length;

  const autoplay = count > 1 && !reducedMotion;
  const paused = !autoplay || userPaused || hovering || focused || hidden;

  const go = useCallback((step) => setIndex((i) => (i + step + count) % count), [count]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  if (count === 0) return <section className="hero hero--empty" aria-hidden="true" />;

  const current = Math.min(index, count - 1);
  const slide = slides[current];

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  const onPointerDown = (e) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured rooms"
      data-paused={paused}
      style={{ '--slide-ms': `${SLIDE_MS}ms` }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      onKeyDown={onKeyDown}
    >
      <div className="hero-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {slides.map((s, i) => (
          <img
            key={s.id}
            src={s.featured}
            alt=""
            className="hero-image"
            data-active={i === current}
            draggable="false"
            width="1500"
            height="930"
          />
        ))}
      </div>

      <div
        className="hero-text"
        key={slide.id}
        aria-live={paused ? 'polite' : 'off'}
        aria-roledescription="slide"
        aria-label={`${current + 1} of ${count}`}
      >
        <h1 className="hero-title">
          {slide.title.split(' ').map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              {i > 0 && ' '}
              <span className="hero-word">
                <span style={{ '--i': i }}>{word}</span>
              </span>
            </Fragment>
          ))}
        </h1>
        <div className="hero-caption">
          <p>{slide.excerpt}</p>
          <Link to="/shop" className="text-link">
            Shop the collection
          </Link>
        </div>
      </div>

      {count > 1 && (
        <div className="hero-controls">
          <ol className="hero-steps">
            {slides.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="hero-step"
                  aria-current={i === current ? 'true' : undefined}
                  data-state={i < current ? 'done' : i === current ? 'active' : 'next'}
                  onClick={() => setIndex(i)}
                >
                  <span className="hero-step-line">
                    {i === current && (
                      <span
                        key={`${current}-${autoplay}`}
                        className="hero-step-fill"
                        data-animate={autoplay}
                        onAnimationEnd={() => go(1)}
                      />
                    )}
                  </span>
                  <span className="hero-step-label">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="hero-buttons">
            <button type="button" className="plain-button" onClick={() => go(-1)} aria-label="Previous slide">
              Previous
            </button>
            <button type="button" className="plain-button" onClick={() => go(1)} aria-label="Next slide">
              Next
            </button>
            {autoplay && (
              <button type="button" className="plain-button" onClick={() => setUserPaused((p) => !p)}>
                {userPaused ? 'Play' : 'Pause'}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
