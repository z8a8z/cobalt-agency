import { useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import kirkukCityscape from '../assets/kirkuk-cityscape.webp';
import './VisitCta.css';

const WHATSAPP_URL =
  'https://wa.me/96407703198849?text=مرحباً، أريد حجز زيارة لمناقشة خدماتكم.';

export default function VisitCta() {
  const sectionRef = useScrollReveal<HTMLElement>({
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px',
  });
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) return;

    const supportsInteraction = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );

    if (!supportsInteraction.matches) return;

    let buttonFrameId = 0;
    let buttonBounds: DOMRect | null = null;
    let buttonPointer = { x: 0, y: 0 };

    const updateButtonPosition = (event: PointerEvent) => {
      const rect = buttonBounds ?? button.getBoundingClientRect();
      buttonBounds = rect;
      buttonPointer = {
        x: event.clientX - (rect.left + rect.width / 2),
        y: event.clientY - (rect.top + rect.height / 2),
      };

      if (buttonFrameId) return;

      buttonFrameId = requestAnimationFrame(() => {
        const maxOffset = 11;
        const pullX = Math.max(-maxOffset, Math.min(maxOffset, buttonPointer.x * 0.22));
        const pullY = Math.max(-maxOffset, Math.min(maxOffset, buttonPointer.y * 0.28));

        button.style.setProperty('--magnetic-x', `${pullX}px`);
        button.style.setProperty('--magnetic-y', `${pullY}px`);
        buttonFrameId = 0;
      });
    };

    const resetButtonPosition = () => {
      if (buttonFrameId) {
        cancelAnimationFrame(buttonFrameId);
        buttonFrameId = 0;
      }

      buttonBounds = null;
      button.style.setProperty('--magnetic-x', '0px');
      button.style.setProperty('--magnetic-y', '0px');
    };

    const cacheButtonBounds = () => {
      buttonBounds = button.getBoundingClientRect();
    };

    button.addEventListener('pointerenter', cacheButtonBounds, { passive: true });
    button.addEventListener('pointermove', updateButtonPosition, { passive: true });
    button.addEventListener('pointerleave', resetButtonPosition);

    return () => {
      cancelAnimationFrame(buttonFrameId);
      button.removeEventListener('pointerenter', cacheButtonBounds);
      button.removeEventListener('pointermove', updateButtonPosition);
      button.removeEventListener('pointerleave', resetButtonPosition);
    };
  }, []);

  return (
    <section
      className="visit-cta section reveal"
      ref={sectionRef}
      aria-labelledby="visit-cta-title"
    >
      <div className="section-divider-line" aria-hidden="true" />
      <div className="visit-cta__ambient" aria-hidden="true" />

      <div className="visit-cta__container">
        <div className="visit-cta__surface">
          <div className="visit-cta__content">
            <div className="visit-cta__heading-wrap">
              <span className="visit-cta__signal" aria-hidden="true">
                <span />
              </span>
              <h2 id="visit-cta-title">نجيكم وين ما كنتوا</h2>
            </div>

            <p className="visit-cta__text">
              يسعدنا زيارتكم في موقعكم للإجابة عن أسئلتكم ومناقشة احتياجات أعمالكم.
            </p>

            <div className="visit-cta__actions">
              <a
                ref={buttonRef}
                href={WHATSAPP_URL}
                className="btn btn-accent visit-cta__button"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="احجز زيارة عبر واتساب"
              >
                <span className="visit-cta__button-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.5 11.6a8.5 8.5 0 0 1-12.56 7.47L3.5 20.5l1.45-4.32A8.5 8.5 0 1 1 20.5 11.6Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.25 7.85c.2-.45.42-.46.63-.47h.53c.17 0 .45.06.69.59.23.52.79 1.82.86 1.95.07.14.11.3.02.47-.09.17-.14.28-.28.43-.14.16-.3.35-.42.47-.14.14-.29.3-.12.58.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.14.46.12.63-.07.17-.2.72-.84.92-1.13.19-.29.39-.24.65-.14.27.09 1.69.79 1.98.93.29.14.48.21.55.33.07.12.07.7-.16 1.37-.24.67-1.39 1.28-1.91 1.36-.49.08-1.1.12-1.78-.1-.41-.14-.94-.3-1.62-.59-.28-.12-4.83-1.78-6.63-6.17-.25-.61-.03-1.82.43-2.32Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span>احجز زيارة</span>
                <span className="visit-cta__button-arrow" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <path
                      d="M12.75 4.75 7.5 10l5.25 5.25"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>

              <p className="visit-cta__location">
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="10" r="2.4" fill="currentColor" />
                  </svg>
                </span>
                كركوك، العراق
              </p>
            </div>
          </div>

          <div className="visit-cta__visual" aria-hidden="true">
            <img
              src={kirkukCityscape}
              alt=""
              className="visit-cta__image"
              loading="lazy"
              decoding="async"
            />
            <div className="visit-cta__image-shade" />

            <span className="visit-cta__map-dot visit-cta__map-dot--start" />
            <span className="visit-cta__map-pin">
              <span className="visit-cta__map-pin-core" />
            </span>

            <div className="visit-cta__frame-corner visit-cta__frame-corner--top" />
            <div className="visit-cta__frame-corner visit-cta__frame-corner--bottom" />
          </div>
        </div>
      </div>
    </section>
  );
}
