import { useEffect, useRef } from 'react';
import { useElementInView } from '../hooks/useElementInView';
import { usePointerSpotlight } from '../hooks/usePointerSpotlight';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './QrMenuLoop/qr-menu-loop.js';
import './Services.css';

function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useScrollReveal<HTMLDivElement>();
  const card1Ref = useScrollReveal<HTMLDivElement>();
  const card2Ref = useScrollReveal<HTMLDivElement>();
  const isPreviewActive = useElementInView(sectionRef, { rootMargin: '250px 0px' });
  const bioLinkSpotlight = usePointerSpotlight<HTMLDivElement>();
  const qrMenuSpotlight = usePointerSpotlight<HTMLDivElement>();
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = qrContainerRef.current;

    if (!container) return;

    if (!isPreviewActive) {
      container.replaceChildren();
      return;
    }

    const qrMenu = document.createElement('qr-menu-loop');
    qrMenu.setAttribute('speed', '1');
    qrMenu.style.setProperty('--qml-bg', 'transparent');
    qrMenu.style.width = '100%';
    qrMenu.style.height = '100%';
    qrMenu.style.flex = '1';
    qrMenu.style.display = 'flex';
    container.replaceChildren(qrMenu);

    return () => container.replaceChildren();
  }, [isPreviewActive]);

  return (
    <section id="services" className="section" ref={sectionRef}>
      <div className="section-divider-line" aria-hidden="true" />
      <div className="container">
        <div className="services-header reveal" ref={headerRef}>
          <span className="badge">ماذا نقدم</span>
          <h2>خدماتنا</h2>
        </div>

        <div className="services-grid">
          <div
            ref={card1Ref}
            className="card accent-border-top service-card spotlight-card reveal reveal-delay-1"
            style={bioLinkSpotlight.style}
            {...bioLinkSpotlight.handlers}
          >
            <div className="service-card-content">
              <div className="service-card-header">
                <svg
                  className="service-card-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span className="service-card-subtitle">وصلة رقمية ذكية</span>
              </div>
              <h3>صفحة Bio Link</h3>
              <p>صفحة واحدة تجمع كل روابط عملك — سوشال ميديا، موقع، واتساب.</p>
            </div>

            <div className="service-card-mockup service-card-mockup--biolink">
              <div className="biolink-mockup-ambient" aria-hidden="true" />
              <div className="biolink-mockup-grid" aria-hidden="true" />
              <div className="biolink-phone">
                <div className="biolink-phone-body">
                  <div className="biolink-phone-speaker" />
                  <div className="biolink-phone-screen">
                    {isPreviewActive && (
                      <iframe
                        src="/demos/bio-links/biolink_loop.html"
                        className="biolink-loop-frame"
                        title="معاينة صفحة Bio Link — تجربة تفاعلية"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="biolink-phone-button" />
                </div>
              </div>
            </div>
          </div>

          <div
            ref={card2Ref}
            className="card accent-border-top service-card spotlight-card reveal reveal-delay-2"
            style={qrMenuSpotlight.style}
            {...qrMenuSpotlight.handlers}
          >
            <div className="service-card-content">
              <div className="service-card-header">
                <svg
                  className="service-card-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="3" height="3" rx="0.5" />
                  <path d="M21 14h-3v3" />
                  <path d="M14 21v-3h3" />
                  <path d="M21 21h-3v-3" />
                </svg>
                <span className="service-card-subtitle">قائمة رقمية للطاولة</span>
              </div>
              <h3>قائمة QR ذكية</h3>
              <p>قائمة طعام رقمية مع QR مطبوع — زبونك يمسح ويطلب.</p>
            </div>
            <div className="service-card-mockup service-card-mockup--qr">
              <div ref={qrContainerRef} className="qr-embed-host" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
