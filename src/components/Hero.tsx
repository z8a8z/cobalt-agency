import { useEffect, useRef, useState } from 'react';
import { useElementInView } from '../hooks/useElementInView';
import './Hero.css';

const WHATSAPP_URL = 'https://wa.me/96407703198849';

interface HeroProps {
  introActive: boolean;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

function Hero({ introActive }: HeroProps) {
  const [isReady, setIsReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const isHeroInView = useElementInView(heroRef, { threshold: 0.05 });
  const primaryBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (introActive) {
      setIsReady(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setIsReady(true), 90);
    return () => window.clearTimeout(timeoutId);
  }, [introActive]);

  useEffect(() => {
    const button = primaryBtnRef.current;
    if (!button) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    let frameId = 0;

    const handlePointerMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        const maxOffset = 11;
        const pullX = Math.max(-maxOffset, Math.min(maxOffset, x * 0.28));
        const pullY = Math.max(-maxOffset, Math.min(maxOffset, y * 0.28));

        button.style.setProperty('--hero-button-x', `${pullX}px`);
        button.style.setProperty('--hero-button-y', `${pullY}px`);
      });
    };

    const resetButton = () => {
      window.cancelAnimationFrame(frameId);
      button.style.setProperty('--hero-button-x', '0px');
      button.style.setProperty('--hero-button-y', '0px');
    };

    button.addEventListener('pointermove', handlePointerMove);
    button.addEventListener('pointerleave', resetButton);

    return () => {
      window.cancelAnimationFrame(frameId);
      button.removeEventListener('pointermove', handlePointerMove);
      button.removeEventListener('pointerleave', resetButton);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`hero ${isReady ? 'hero--ready' : ''} ${isHeroInView ? 'hero--in-view' : ''}`}
    >
      <div className="hero__grid-bg" aria-hidden="true" />
      <div className="hero__beam hero__beam--one" aria-hidden="true" />
      <div className="hero__beam hero__beam--two" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__title-line hero__title-line--one">
              نبني لعملك <span className="gradient-text">صفحة احترافية</span>،
            </span>{' '}
            <span className="hero__title-line hero__title-line--two">
              يوصلها زبونك <span className="gradient-text">بثانية</span>.
            </span>
          </h1>

          <div className="hero__cta-row">
            <a
              ref={primaryBtnRef}
              href={WHATSAPP_URL}
              className="btn btn-primary hero__primary-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>ابدأ الآن</span>
              <ArrowIcon />
            </a>
            <a href="#pricing" className="btn btn-secondary hero__secondary-cta">
              <span>شوف الأسعار</span>
              <ArrowIcon />
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__visual-stage" aria-hidden="true">
            <span className="hero__orbit hero__orbit--outer" />
            <span className="hero__orbit hero__orbit--inner" />
            <span className="hero__stage-dot hero__stage-dot--one" />
            <span className="hero__stage-dot hero__stage-dot--two" />
            <span className="hero__stage-dot hero__stage-dot--three" />
          </div>

          <div className="hero__phone-scene">
            <div className="hero__phone-shadow" aria-hidden="true" />
            <div className="hero__phone-wrapper">
              <div className="hero__phone-shell">
                <iframe
                  src="/demos/bio-links/cobalt_agency_bio_link.html"
                  className="hero__phone-iframe"
                  title="معاينة صفحة Bio Link على الهاتف"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          <div className="hero__glow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
