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
    let buttonBounds: DOMRect | null = null;

    const handlePointerMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const rect = buttonBounds ?? button.getBoundingClientRect();
        buttonBounds = rect;
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
      buttonBounds = null;
      button.style.setProperty('--hero-button-x', '0px');
      button.style.setProperty('--hero-button-y', '0px');
    };

    const cacheButtonBounds = () => {
      buttonBounds = button.getBoundingClientRect();
    };

    button.addEventListener('pointerenter', cacheButtonBounds, { passive: true });
    button.addEventListener('pointermove', handlePointerMove);
    button.addEventListener('pointerleave', resetButton);

    return () => {
      window.cancelAnimationFrame(frameId);
      button.removeEventListener('pointerenter', cacheButtonBounds);
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
              نبني حضورك <span className="gradient-text">الرقمي</span>،
            </span>{' '}
            <span className="hero__title-line hero__title-line--two">
              بالشكل الذي <span className="gradient-text">يمثلك</span>.
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
            <a href="#services" className="btn btn-secondary hero__secondary-cta">
              <span>استكشف الخدمات</span>
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

          <div className="hero__project-scene" aria-label="معاينة لمشروع رقمي">
            <div className="hero__browser">
              <div className="hero__browser-bar">
                <span /><span /><span />
                <i />
              </div>
              <div className="hero__browser-page">
                <div className="hero__browser-copy">
                  <span className="hero__browser-kicker">حضور رقمي</span>
                  <strong>خلِّ عملك<br />أسهل للاختيار.</strong>
                  <p />
                  <p />
                  <span className="hero__browser-cta">اكتشف المشروع</span>
                </div>
                <div className="hero__browser-art">
                  <span /><span /><span /><span />
                </div>
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
