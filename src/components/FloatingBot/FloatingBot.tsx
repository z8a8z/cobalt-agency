import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import './FloatingBot.css';

export interface FloatingBotProps {
  size?: number;
  edgeGap?: number;
  paused?: boolean;
  zIndex?: number;
  className?: string;
}

type BotSection = 'hero' | 'services' | 'process' | 'pricing' | 'demo' | 'about' | 'visit' | 'footer';
type BotSide = 'start' | 'end';

interface BotPlacement {
  side: BotSide;
  vertical: number;
}

const SECTION_TARGETS: ReadonlyArray<{ section: BotSection; selector: string }> = [
  { section: 'hero', selector: '#hero' },
  { section: 'services', selector: '#services' },
  { section: 'process', selector: '#process' },
  { section: 'pricing', selector: '#pricing' },
  { section: 'demo', selector: '#demo' },
  { section: 'about', selector: '#about' },
  { section: 'visit', selector: '.visit-cta' },
  { section: 'footer', selector: '.footer' },
];

const SECTION_PLACEMENTS: Record<Exclude<BotSection, 'hero'>, BotPlacement> = {
  services: { side: 'start', vertical: 0.72 },
  process: { side: 'end', vertical: 0.74 },
  pricing: { side: 'start', vertical: 0.78 },
  demo: { side: 'end', vertical: 0.72 },
  about: { side: 'start', vertical: 0.76 },
  visit: { side: 'end', vertical: 0.7 },
  footer: { side: 'start', vertical: 0.76 },
};

type BotStyle = CSSProperties & {
  '--bot-size': string;
  '--bot-z': number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export default function FloatingBot({
  size = 70,
  edgeGap = 18,
  paused = false,
  zIndex = 90,
  className = '',
}: FloatingBotProps) {
  const botRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<BotSection>('hero');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const updatePosition = useCallback(() => {
    const bot = botRef.current;
    if (!bot) return;

    const maximumX = Math.max(edgeGap, window.innerWidth - size - edgeGap);
    const maximumY = Math.max(edgeGap, window.innerHeight - size - edgeGap);
    let x = maximumX;
    let y = maximumY;

    if (activeSection === 'hero') {
      const targetRect = document.querySelector<HTMLElement>('.hero__primary-cta')?.getBoundingClientRect();
      const targetIsVisible = targetRect
        && targetRect.bottom > 0
        && targetRect.top < window.innerHeight
        && targetRect.right > 0
        && targetRect.left < window.innerWidth;

      if (targetIsVisible && targetRect) {
        x = clamp(targetRect.right + edgeGap, edgeGap, maximumX);
        y = clamp(targetRect.top - size - edgeGap, edgeGap, maximumY);
      }
    } else if (window.innerWidth > 700) {
      const placement = SECTION_PLACEMENTS[activeSection];
      x = placement.side === 'start' ? edgeGap : maximumX;
      y = clamp(window.innerHeight * placement.vertical - size / 2, edgeGap, maximumY);
    } else {
      const placement = SECTION_PLACEMENTS[activeSection];
      x = placement.side === 'start' ? edgeGap : maximumX;
    }

    bot.style.setProperty('--bot-x', `${x}px`);
    bot.style.setProperty('--bot-y', `${y}px`);
    bot.dataset.ready = 'true';
  }, [activeSection, edgeGap, size]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const visibility = new Map<BotSection, number>();
    const observed = SECTION_TARGETS.flatMap(({ section, selector }) => {
      const element = document.querySelector<HTMLElement>(selector);
      return element ? [{ element, section }] : [];
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = observed.find(({ element }) => element === entry.target);
        if (target) visibility.set(target.section, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let next: BotSection | null = null;
      let highestRatio = 0;
      visibility.forEach((ratio, section) => {
        if (ratio > highestRatio) {
          highestRatio = ratio;
          next = section;
        }
      });

      if (next !== null) {
        const nextSection = next;
        setActiveSection((current) => current === nextSection ? current : nextSection);
      }
    }, {
      rootMargin: '-30% 0px -38%',
      threshold: [0, 0.1, 0.25, 0.5],
    });

    observed.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frameId: number | null = null;

    const schedulePositionUpdate = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updatePosition();
      });
    };

    window.addEventListener('resize', schedulePositionUpdate, { passive: true });
    window.addEventListener('scroll', schedulePositionUpdate, { passive: true });
    schedulePositionUpdate();

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', schedulePositionUpdate);
      window.removeEventListener('scroll', schedulePositionUpdate);
    };
  }, [updatePosition]);

  const style: BotStyle = {
    '--bot-size': `${size}px`,
    '--bot-z': zIndex,
  };
  const classes = ['cobalt-flybot', className].filter(Boolean).join(' ');

  return (
    <div
      ref={botRef}
      className={classes}
      style={style}
      data-paused={paused}
      data-ready="false"
      aria-hidden="true"
    >
      <span
        key={activeSection}
        className="cobalt-flybot__motion"
        data-motion={prefersReducedMotion ? 'still' : activeSection}
      >
        <svg className="cobalt-flybot__svg" viewBox="0 0 70 70" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="cobalt-bot-shell" x1="17" y1="13" x2="56" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="hsl(var(--primary-hue), 16%, 21%)" />
              <stop offset="0.48" stopColor="hsl(var(--primary-hue), 14%, 11%)" />
              <stop offset="1" stopColor="hsl(var(--primary-hue), 18%, 6%)" />
            </linearGradient>
            <radialGradient id="cobalt-bot-eye" cx="0" cy="0" r="1" gradientTransform="translate(36 34) rotate(90) scale(12)">
              <stop stopColor="hsl(var(--primary-hue), 100%, 78%)" />
              <stop offset="0.42" stopColor="var(--primary)" />
              <stop offset="1" stopColor="hsl(var(--primary-hue), 100%, 34%)" />
            </radialGradient>
          </defs>

          <path d="M35 14V8" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="35" cy="6.5" r="2.5" fill="var(--primary)" />
          <path className="cobalt-flybot__fin" d="M13 29.5C8.8 30.4 7 33.3 7 36.5C7 39.7 8.8 42.6 13 43.5V29.5Z" />
          <path className="cobalt-flybot__fin" d="M57 29.5C61.2 30.4 63 33.3 63 36.5C63 39.7 61.2 42.6 57 43.5V29.5Z" />
          <rect x="12.5" y="13.5" width="45" height="44" rx="18" fill="url(#cobalt-bot-shell)" stroke="hsla(var(--primary-hsl), 0.52)" />
          <path d="M20 21C24.2 16.9 29.2 15.8 35 15.8" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="18.5" y="21.5" width="33" height="28" rx="13" fill="hsla(var(--primary-hsl), 0.08)" stroke="hsla(var(--primary-hsl), 0.26)" />
          <circle cx="35" cy="35" r="9.5" fill="hsla(var(--primary-hsl), 0.08)" stroke="hsla(var(--primary-hsl), 0.35)" />
          <path d="M39.8 29.8A7 7 0 1 0 39.8 40.2" stroke="url(#cobalt-bot-eye)" strokeWidth="3.1" strokeLinecap="round" />
          <circle cx="40" cy="35" r="2.6" fill="url(#cobalt-bot-eye)" />
          <circle cx="40.8" cy="34.1" r="0.75" fill="white" fillOpacity="0.9" />
          <path d="M29 53.5H41" stroke="hsla(var(--primary-hsl), 0.55)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}
