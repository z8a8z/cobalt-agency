import { useState, useEffect, useRef, useCallback } from 'react';
import './Navbar.css';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'الأسعار', href: '#pricing' },
  { label: 'من نحن', href: '#about' },
];

const WHATSAPP_URL = 'https://wa.me/96407703198849';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  /* ── Track scroll progress ── */
  useEffect(() => {
    let frameId: number | null = null;

    const updateScrollProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;

      progressRef.current?.style.setProperty('transform', `scaleX(${progress})`);
      frameId = null;
    };

    const handleScroll = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  /* ── Scroll detection via IntersectionObserver ── */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 1.0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Sentinel element at top of page for IntersectionObserver */}
      <div ref={sentinelRef} className="navbar-sentinel" aria-hidden="true" />

      <header
        className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
        role="banner"
      >
        {/* ── Brand (Right in RTL) ── */}
        <a href="#hero" className="navbar__brand" aria-label="كوبالت — الصفحة الرئيسية">
          <svg
            className="navbar__logo-svg"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Large open C */}
            <path
              d="M38 12.5C34.5 7 28.5 4 22 4C11.5 4 4 12.5 4 24C4 35.5 11.5 44 22 44C28.5 44 34.5 41 38 35.5"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Small nested o circle */}
            <circle
              cx="30"
              cy="24"
              r="7"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
          </svg>
          <span className="navbar__wordmark">كوبالت</span>
        </a>

        {/* ── Desktop Nav Links (Center) ── */}
        <nav className="navbar__nav" aria-label="التنقل الرئيسي">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__nav-link nav-link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Desktop CTA (Left in RTL) ── */}
        <div className="navbar__cta">
          <a
            href={WHATSAPP_URL}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            تواصل معنا
          </a>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          type="button"
          className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile-menu"
          aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
        >
          <span className="navbar__hamburger-icon" aria-hidden="true">
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </span>
        </button>
        <div
          ref={progressRef}
          className="navbar__progress-bar"
          aria-hidden="true"
        />
      </header>

      {/* ── Mobile Full-Screen Overlay ── */}
      <nav
        id="navbar-mobile-menu"
        className={`navbar__overlay${menuOpen ? ' navbar__overlay--open' : ''}`}
        aria-label="القائمة المحمولة"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="navbar__overlay-link"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            {link.label}
          </a>
        ))}
        <div className="navbar__overlay-cta">
          <a
            href={WHATSAPP_URL}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            تواصل معنا
          </a>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
