import { useEffect, useState } from 'react';
import './IntroOverlay.css';

export default function IntroOverlay() {
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const logoTimer = window.setTimeout(() => setLogoVisible(true), 160);
    const textTimer = window.setTimeout(() => setTextVisible(true), 690);
    const exitTimer = window.setTimeout(() => setIsFadingOut(true), 2350);

    return () => {
      window.clearTimeout(logoTimer);
      window.clearTimeout(textTimer);
      window.clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div
      className={`intro-overlay ${logoVisible ? 'intro-overlay--logo-visible' : ''} ${textVisible ? 'intro-overlay--text-visible' : ''} ${isFadingOut ? 'intro-overlay--fadeout' : ''}`}
      role="presentation"
    >
      <div className="intro-overlay__grid-bg" aria-hidden="true" />
      <div className="intro-overlay__vignette" aria-hidden="true" />
      <div className="intro-overlay__glow" aria-hidden="true" />
      <div className="intro-overlay__scan" aria-hidden="true" />

      <div className="intro-overlay__content">
        <div className="intro-overlay__emblem-stage">
          <span className="intro-overlay__ring intro-overlay__ring--outer" aria-hidden="true" />
          <span className="intro-overlay__ring intro-overlay__ring--inner" aria-hidden="true" />
          <span className="intro-overlay__particle intro-overlay__particle--one" aria-hidden="true" />
          <span className="intro-overlay__particle intro-overlay__particle--two" aria-hidden="true" />
          <span className="intro-overlay__particle intro-overlay__particle--three" aria-hidden="true" />

          <div className="intro-overlay__logo-container">
            <svg
              className="intro-overlay__logo-svg"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                className="intro-overlay__logo-path"
                d="M38 12.5C34.5 7 28.5 4 22 4C11.5 4 4 12.5 4 24C4 35.5 11.5 44 22 44C28.5 44 34.5 41 38 35.5"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle
                className="intro-overlay__logo-circle"
                cx="30"
                cy="24"
                r="7"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <p className="intro-overlay__title">
          <span className="brand-en">Cobalt Agency</span>
          <span className="brand-ar">وكالة كوبالت</span>
        </p>

        <div className="intro-overlay__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
