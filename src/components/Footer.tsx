import cobaltLogo from '../cobalt-logo.svg';
import './Footer.css';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.5 10h10M10.5 6l4 4-4 4" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__ambient" aria-hidden="true" />
      <div className="footer__grid-lines" aria-hidden="true" />
      <div className="footer__top-line" aria-hidden="true" />

      <div className="footer__grid">
        <div className="footer__brand footer__panel">
          <div className="footer__logo">
            <span className="footer__logo-mark">
              <img src={cobaltLogo} alt="" />
            </span>
            <span>كوبالت</span>
          </div>
          <p className="footer__brand-desc">
            خدمات رقمية بسيطة للأعمال المحلية.
          </p>
          <div className="footer__brand-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <nav className="footer__panel footer__navigation" aria-label="روابط سريعة">
          <h3 className="footer__heading">روابط سريعة</h3>
          <div className="footer__links">
            <a href="#services">
              <span>خدماتنا</span>
              <ArrowIcon />
            </a>
            <a href="#pricing">
              <span>نطاق المشروع</span>
              <ArrowIcon />
            </a>
            <a href="#about">
              <span>من نحن</span>
              <ArrowIcon />
            </a>
            <a
              href="https://wa.me/96407703198849"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>تواصل معنا</span>
              <ArrowIcon />
            </a>
          </div>
        </nav>

        <div className="footer__panel footer__contact">
          <h3 className="footer__heading">تواصل معنا</h3>
          <div className="footer__contact-list">
            <div className="footer__contact-item">
              <span className="footer__contact-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <a href="tel:+96407703198849" className="ltr-text footer__contact-value">
                07703198849
              </a>
            </div>

            <div className="footer__contact-item">
              <span className="footer__contact-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <a href="mailto:info@cobalt.autos" className="ltr-text footer__contact-value">
                info@cobalt.autos
              </a>
            </div>

            <div className="footer__contact-item">
              <span className="footer__contact-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className="footer__contact-value">كركوك، العراق</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          <span className="ltr-text footer__copyright-en">
            © 2025 وكالة كوبالت.
          </span>{' '}
          جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
