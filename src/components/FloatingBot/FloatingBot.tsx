import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
  useCallback,
} from 'react';
import callusSound from '../../assets/callus.mp3';
import './FloatingBot.css';

/* ═══════════════════════════════════════════════════════
   Types & Constants
   ═══════════════════════════════════════════════════════ */

export interface FloatingBotProps {
  /** Bot width and height in pixels. */
  size?: number;
  /** Space preserved from the left, right, and bottom viewport edges. */
  edgeGap?: number;
  /** Space preserved at the top, normally for the navbar. */
  topInset?: number;
  /** Milliseconds needed to complete one patrol loop. */
  orbitDuration?: number;
  /** Delay before the bot enters the frame. */
  startDelay?: number;
  /** Reverse the patrol direction. */
  reverse?: boolean;
  /** Freeze the bot without unmounting it. */
  paused?: boolean;
  /** Pause flight while hovered or keyboard-focused. */
  pauseOnInteraction?: boolean;
  /** Enable click, hover, and keyboard interaction. */
  interactive?: boolean;
  /** Layer position. */
  zIndex?: number;
  /** Accessible button label. It is never visually rendered. */
  ariaLabel?: string;
  /** Optional class name applied to the root. */
  className?: string;
  /** Connect this to a future assistant panel. */
  onActivate?: () => void;
}

type BotStyle = CSSProperties & {
  '--bot-size': string;
  '--bot-z': number;
};

type SectionMode =
  | 'patrol'
  | 'hero'
  | 'services'
  | 'process'
  | 'pricing'
  | 'demo'
  | 'about'
  | 'visit-cta'
  | 'footer';

interface Vec2 {
  x: number;
  y: number;
}

const TAU = Math.PI * 2;

/* Section selectors, mapped to their intersection target + key child element */
const SECTION_MAP: { mode: SectionMode; selector: string }[] = [
  { mode: 'hero', selector: '#hero' },
  { mode: 'services', selector: '#services' },
  { mode: 'process', selector: '#process' },
  { mode: 'pricing', selector: '#pricing' },
  { mode: 'demo', selector: '#demo' },
  { mode: 'about', selector: '#about' },
  { mode: 'visit-cta', selector: '.visit-cta' },
  { mode: 'footer', selector: '.footer' },
];

/* Money symbols for the pricing section particle shower */
const MONEY_SYMBOLS = ['$', '💰', '💵', '🪙', '₿', '💎', '💲'];
const LASER_INTERVAL = 1_000;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

function superellipse(angle: number, exponent = 4.6) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const power = 2 / exponent;
  return {
    x: Math.sign(cosine) * Math.pow(Math.abs(cosine), power),
    y: Math.sign(sine) * Math.pow(Math.abs(sine), power),
  };
}

/** Get element center in viewport coordinates */
function getElCenter(el: Element | null): Vec2 | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Get element top-center in viewport coordinates */
function getElTopCenter(el: Element | null): Vec2 | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top };
}

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */

export default function FloatingBot({
  size = 70,
  edgeGap = 18,
  topInset = 84,
  orbitDuration = 34_000,
  startDelay = 700,
  reverse = false,
  paused = false,
  pauseOnInteraction = true,
  interactive = true,
  zIndex = 90,
  ariaLabel = 'فتح المساعد',
  className = '',
  onActivate,
}: FloatingBotProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const pausedRef = useRef(paused);
  const activeSectionRef = useRef<SectionMode>('patrol');
  const moneyContainerRef = useRef<HTMLDivElement>(null);
  const activationTimerRef = useRef<number | null>(null);

  const [activated, setActivated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentMode, setCurrentMode] = useState<SectionMode>('patrol');
  const [showHeart, setShowHeart] = useState(false);

  const [isLaserActive, setIsLaserActive] = useState(false);
  const [hasInterrupted, setHasInterrupted] = useState(false);
  const isLaserActiveRef = useRef(false);
  isLaserActiveRef.current = isLaserActive;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const shootLaser = useCallback(() => {
    const button = document.querySelector('.hero__primary-cta');
    const botEl = rootRef.current;
    if (!button || !botEl) return;

    const botRect = botEl.getBoundingClientRect();
    const botX = botRect.left + botRect.width / 2;
    const botY = botRect.top + botRect.height / 2;

    const btnRect = button.getBoundingClientRect();
    const btnX = btnRect.left + btnRect.width / 2;
    const btnY = btnRect.top + btnRect.height / 2;

    const bullet = document.createElement('span');
    bullet.className = 'cobalt-flybot__laser-bullet';
    bullet.style.left = `${botX}px`;
    bullet.style.top = `${botY}px`;

    const dx = btnX - botX;
    const dy = btnY - botY;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    bullet.style.setProperty('--dx', `${dx}px`);
    bullet.style.setProperty('--dy', `${dy}px`);
    bullet.style.setProperty('--rot', `${angle}deg`);

    document.body.appendChild(bullet);

    setTimeout(() => {
      bullet.remove();

      button.classList.add('btn-laser-impact');
      setTimeout(() => {
        button.classList.remove('btn-laser-impact');
      }, 150);

      const MUSIC_ICONS = ['🎵', '🎶', '🎼', '🎹', '🎸', '🎷', '🎺'];
      const count = 3;
      for (let i = 0; i < count; i++) {
        const icon = document.createElement('span');
        icon.className = 'cobalt-flybot__music-particle';
        icon.textContent = MUSIC_ICONS[Math.floor(Math.random() * MUSIC_ICONS.length)];
        icon.style.left = `${btnX}px`;
        icon.style.top = `${btnY}px`;

        const particleAngle = Math.random() * 360;
        const distance = 40 + Math.random() * 70;
        const pdx = Math.cos((particleAngle * Math.PI) / 180) * distance;
        const pdy = Math.sin((particleAngle * Math.PI) / 180) * distance;

        icon.style.setProperty('--dx', `${pdx}px`);
        icon.style.setProperty('--dy', `${pdy}px`);
        icon.style.setProperty('--rot', `${-180 + Math.random() * 360}deg`);
        icon.style.setProperty('--scale', `${0.6 + Math.random() * 0.6}`);

        document.body.appendChild(icon);
        setTimeout(() => {
          icon.remove();
        }, 800);
      }
    }, 400);
  }, []);

  // Timer for triggering laser in hero section
  useEffect(() => {
    if (currentMode !== 'hero') {
      setIsLaserActive(false);
      setHasInterrupted(false);
      return;
    }

    if (hasInterrupted) {
      setIsLaserActive(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLaserActive(true);
    }, 12000);

    return () => clearTimeout(timer);
  }, [currentMode, hasInterrupted]);

  // Listen for scrolls and clicks to stop lasers and sound
  useEffect(() => {
    if (currentMode !== 'hero' || hasInterrupted) return;

    const handleInteraction = (event: Event) => {
      if (event.type === 'click') {
        const target = event.target as HTMLElement;
        if (!target.closest('button') && !target.closest('a')) {
          return;
        }
      }
      setHasInterrupted(true);
      setIsLaserActive(false);
    };

    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction, { capture: true });

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction, { capture: true });
    };
  }, [currentMode, hasInterrupted]);

  // Audio control effect
  useEffect(() => {
    if (isLaserActive) {
      if (!audioRef.current) {
        audioRef.current = new Audio(callusSound);
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch((err) => {
        console.warn('Autoplay blocked or audio failed to load:', err);
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isLaserActive]);

  // Laser firing interval
  useEffect(() => {
    if (!isLaserActive) return;

    const intervalId = setInterval(() => {
      shootLaser();
    }, LASER_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isLaserActive, shootLaser]);

  const id = useId().replace(/:/g, '');
  pausedRef.current = paused;

  /* ── Reduced motion ── */
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  /* ── Section Intersection Observer & Bottom Page Detection ── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_MAP.forEach(({ mode, selector }) => {
      const el = document.querySelector(selector);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            /* Force bottom/footer mode if scroll is at the very bottom */
            const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
            if (isBottom) {
              activeSectionRef.current = 'footer';
              setCurrentMode('footer');
              return;
            }

            if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
              activeSectionRef.current = mode;
              setCurrentMode(mode);
            }
          });
        },
        { threshold: [0.25, 0.5] }
      );

      observer.observe(el);
      observers.push(observer);
    });

    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isBottom) {
        activeSectionRef.current = 'footer';
        setCurrentMode('footer');
      } else if (activeSectionRef.current === 'footer') {
        activeSectionRef.current = 'patrol';
        setCurrentMode('patrol');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* ── Money Particle Spawner ── */
  const spawnMoney = useCallback(() => {
    const container = moneyContainerRef.current;
    if (!container) return;

    const symbol = MONEY_SYMBOLS[Math.floor(Math.random() * MONEY_SYMBOLS.length)];
    const particle = document.createElement('span');
    particle.className = 'cobalt-flybot__money-particle';
    particle.textContent = symbol;

    /* Random direction: angle between 0 and 360 */
    const angle = Math.random() * 360;
    const distance = 60 + Math.random() * 100;
    const dx = Math.cos((angle * Math.PI) / 180) * distance;
    const dy = Math.sin((angle * Math.PI) / 180) * distance;

    particle.style.setProperty('--money-dx', `${dx}px`);
    particle.style.setProperty('--money-dy', `${dy}px`);
    particle.style.setProperty('--money-rot', `${-180 + Math.random() * 360}deg`);
    particle.style.setProperty('--money-scale', `${0.7 + Math.random() * 0.6}`);

    container.appendChild(particle);

    /* Remove after animation */
    setTimeout(() => {
      particle.remove();
    }, 1100);
  }, []);

  /* ── Money Burst Spawner for Pricing Section ── */
  useEffect(() => {
    if (currentMode !== 'pricing') return;

    let timerId: number;
    let isMounted = true;

    const runBurst = () => {
      if (!isMounted) return;

      /* Spawn a burst of 6 coins */
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          if (isMounted && activeSectionRef.current === 'pricing') {
            spawnMoney();
          }
        }, i * 100);
      }

      /* Schedule next burst in 2.2 seconds */
      timerId = window.setTimeout(runBurst, 2200);
    };

    runBurst();

    return () => {
      isMounted = false;
      window.clearTimeout(timerId);
    };
  }, [currentMode, spawnMoney]);

  /* ── Heart Eye Loop for About Section ── */
  useEffect(() => {
    if (currentMode !== 'about') {
      setShowHeart(false);
      return;
    }

    let timerId: number;
    let isMounted = true;

    const triggerHeart = () => {
      if (!isMounted) return;
      setShowHeart(true);

      setTimeout(() => {
        if (isMounted) setShowHeart(false);
      }, 1000);

      /* Trigger again in 3.2 seconds (aligned after each scan sweep) */
      timerId = window.setTimeout(triggerHeart, 3200);
    };

    /* Delay first heart trigger slightly to align after scan line start */
    timerId = window.setTimeout(triggerHeart, 1500);

    return () => {
      isMounted = false;
      window.clearTimeout(timerId);
    };
  }, [currentMode]);

  /* ── Main Animation Loop ── */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frameId: number | null = null;
    let documentVisible = !document.hidden;
    let patrolAngle = reverse ? Math.PI * 1.12 : -0.12;
    let previousTime = performance.now();
    let previousX = 0;
    let firstFrame = true;
    const createdAt = previousTime;
    const direction = reverse ? -1 : 1;

    /* Smooth current position for lerping */
    let smoothX = -120;
    let smoothY = -120;

    /* Section-specific sub-angle for mini-orbits */
    let sectionSubAngle = 0;

    /* Track card index and time for scan rotation in About section */
    let currentAboutCardIndex = 0;
    let lastAboutIndexSwitchTime = previousTime;
    const heroButton = document.querySelector('.hero__primary-cta');
    const heroPhone = document.querySelector('.hero__phone-scene');
    const serviceCards = Array.from(document.querySelectorAll('.service-card'));
    const processSteps = Array.from(document.querySelectorAll('.process-step'));
    const pricingSection = document.querySelector('#pricing');
    const aboutPhotos = Array.from(document.querySelectorAll('.team-profile__media'));
    const visitButton = document.querySelector('.visit-cta__button');

    const updateDevice = () => {
      root.dataset.device = window.innerWidth < 768 ? 'mobile' : 'desktop';
    };

    const setPosition = (x: number, y: number, tilt: number) => {
      const pointer = pointerRef.current;
      const centerX = x + size / 2;
      const centerY = y + size / 2;
      
      let dx = pointer.active ? pointer.x - centerX : 0;
      let dy = pointer.active ? pointer.y - centerY : 0;
      let targetActive = pointer.active;

      if (isLaserActiveRef.current) {
        if (heroButton) {
          const btnRect = heroButton.getBoundingClientRect();
          dx = (btnRect.left + btnRect.width / 2) - centerX;
          dy = (btnRect.top + btnRect.height / 2) - centerY;
          targetActive = true;
        }
      }

      const distance = Math.max(1, Math.hypot(dx, dy));
      const lookStrength = Math.min(4.2, distance / 80);
      const lookX = targetActive ? (dx / distance) * lookStrength : 0;
      const lookY = targetActive ? (dy / distance) * lookStrength : 0;

      root.style.setProperty('--bot-x', `${x.toFixed(2)}px`);
      root.style.setProperty('--bot-y', `${y.toFixed(2)}px`);
      root.style.setProperty('--bot-tilt', `${tilt.toFixed(2)}deg`);
      root.style.setProperty('--bot-look-x', `${lookX.toFixed(2)}px`);
      root.style.setProperty('--bot-look-y', `${lookY.toFixed(2)}px`);

      if (firstFrame) {
        root.dataset.ready = 'true';
        firstFrame = false;
      }
    };

    const getBounds = () => {
      const maxX = Math.max(edgeGap, window.innerWidth - size - edgeGap);
      const safeTop = Math.min(topInset, Math.max(edgeGap, window.innerHeight - size - edgeGap));
      const maxY = Math.max(safeTop, window.innerHeight - size - edgeGap);
      return { minX: edgeGap, maxX, minY: safeTop, maxY };
    };

    const dockBot = () => {
      const bounds = getBounds();
      setPosition(bounds.maxX, bounds.maxY, 0);
    };

    const getPatrolTarget = (delta: number): Vec2 => {
      const interactionPaused = pauseOnInteraction && (hoveredRef.current || focusedRef.current);
      const motionPaused = pausedRef.current || interactionPaused;

      if (!motionPaused) {
        patrolAngle += (delta / Math.max(8_000, orbitDuration)) * TAU * direction;
      }

      const bounds = getBounds();
      const cx = (bounds.minX + bounds.maxX) / 2;
      const cy = (bounds.minY + bounds.maxY) / 2;
      const rx = (bounds.maxX - bounds.minX) / 2;
      const ry = (bounds.maxY - bounds.minY) / 2;
      const point = superellipse(patrolAngle);

      return {
        x: clamp(cx + point.x * rx, bounds.minX, bounds.maxX),
        y: clamp(cy + point.y * ry, bounds.minY, bounds.maxY),
      };
    };

    /* ── Section-specific target computation ── */
    const getSectionTarget = (mode: SectionMode, delta: number): Vec2 | null => {
      sectionSubAngle += (delta / 2200) * TAU;
      const halfBot = size / 2;

      switch (mode) {
        case 'hero': {
          const center = getElCenter(heroPhone);
          if (!center) return null;
          /* Orbit around phone */
          const orbitR = 120;
          return {
            x: center.x + Math.cos(sectionSubAngle * 0.4) * orbitR - halfBot,
            y: center.y + Math.sin(sectionSubAngle * 0.4) * orbitR - halfBot,
          };
        }

        case 'services': {
          /* Hover above whichever service card is hovered, or first card */
          const target = serviceCards.find((card) => card.matches(':hover')) || serviceCards[0];
          const top = getElTopCenter(target);
          if (!top) return null;
          return {
            x: top.x + Math.sin(sectionSubAngle * 0.5) * 16 - halfBot,
            y: top.y - size - 10 + Math.sin(sectionSubAngle * 0.3) * 6,
          };
        }

        case 'process': {
          /* Hover above middle (2nd) step icon */
          const midStep = processSteps[1] || processSteps[0];
          const top = getElTopCenter(midStep);
          if (!top) return null;
          return {
            x: top.x + Math.sin(sectionSubAngle * 0.6) * 20 - halfBot,
            y: top.y - size - 12 + Math.cos(sectionSubAngle * 0.35) * 8,
          };
        }

        case 'pricing': {
          /* Float around the pricing area freely */
          if (!pricingSection) return null;
          const r = pricingSection.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height * 0.4;
          const wanderR = Math.min(r.width * 0.3, 200);
          return {
            x: cx + Math.cos(sectionSubAngle * 0.25) * wanderR - halfBot,
            y: cy + Math.sin(sectionSubAngle * 0.35) * (wanderR * 0.5) - halfBot,
          };
        }

        case 'demo': {
          /* Hover above the focused phone mockup */
          const focused = document.querySelector('.demo-preview__phone-wrapper--focused')
            || document.querySelector('.demo-preview__phone-wrapper');
          const top = getElTopCenter(focused);
          if (!top) return null;
          return {
            x: top.x + Math.sin(sectionSubAngle * 0.4) * 12 - halfBot,
            y: top.y - size - 18 + Math.sin(sectionSubAngle * 0.25) * 10,
          };
        }

        case 'about': {
          /* Hover next to profile photos one by one (filtering for visible ones to prevent scroll conflict) */
          if (aboutPhotos.length === 0) return null;

          // Filter photos that are currently in the viewport
          const visiblePhotos = aboutPhotos.filter((photo) => {
            const rect = photo.getBoundingClientRect();
            // Check if photo is vertically visible inside viewport
            return rect.bottom > 40 && rect.top < window.innerHeight - 40;
          });

          // Fall back to all photos if none are inside viewport
          const targetPhotos = visiblePhotos.length > 0 ? visiblePhotos : aboutPhotos;
          const index = currentAboutCardIndex % targetPhotos.length;
          const photo = targetPhotos[index];
          if (!photo) return null;

          const r = photo.getBoundingClientRect();
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            return {
              x: r.left + r.width / 2 - halfBot,
              y: r.top - size - 12 + Math.sin(sectionSubAngle * 0.4) * 6,
            };
          } else {
            return {
              x: r.right + 16 + Math.sin(sectionSubAngle * 0.3) * 8,
              y: r.top + r.height * 0.35 + Math.cos(sectionSubAngle * 0.4) * 12 - halfBot,
            };
          }
        }

        case 'visit-cta': {
          /* Magnetic orbit around the CTA button */
          const center = getElCenter(visitButton);
          if (!center) return null;
          const magR = 50 + Math.sin(sectionSubAngle * 1.2) * 18;
          const vx = Math.sin(sectionSubAngle * 4.2) * 2;
          const vy = Math.cos(sectionSubAngle * 3.4) * 2;
          return {
            x: center.x + Math.cos(sectionSubAngle * 0.8) * magR - halfBot + vx,
            y: center.y + Math.sin(sectionSubAngle * 0.8) * magR - halfBot + vy,
          };
        }

        case 'footer': {
          /* Dock in bottom-right corner and sleep */
          const bounds = getBounds();
          return {
            x: bounds.maxX,
            y: bounds.maxY,
          };
        }

        default:
          return null;
      }
    };

    function scheduleAnimation() {
      if (documentVisible && frameId === null) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    const animate = (now: number) => {
      frameId = null;

      if (!documentVisible) return;

      const delta = Math.min(64, now - previousTime);
      previousTime = now;
      const waiting = now - createdAt < startDelay;

      if (prefersReducedMotion) {
        dockBot();
        return;
      }

      const mode = activeSectionRef.current;
      let targetX: number;
      let targetY: number;

      if (mode === 'about') {
        if (now - lastAboutIndexSwitchTime > 3200) {
          currentAboutCardIndex++;
          lastAboutIndexSwitchTime = now;
        }
      } else {
        currentAboutCardIndex = 0;
        lastAboutIndexSwitchTime = now;
      }

      const sectionTarget = mode !== 'patrol' ? getSectionTarget(mode, delta) : null;

      if (sectionTarget && !waiting) {
        targetX = sectionTarget.x;
        targetY = sectionTarget.y;
        /* Also advance patrol angle so returning to patrol isn't jarring */
        patrolAngle += (delta / Math.max(8_000, orbitDuration)) * TAU * direction * 0.3;
      } else {
        const patrol = getPatrolTarget(delta);
        targetX = patrol.x;
        targetY = patrol.y;
      }

      /* Clamp to viewport */
      const bounds = getBounds();
      targetX = clamp(targetX, bounds.minX, bounds.maxX);
      targetY = clamp(targetY, bounds.minY, bounds.maxY);

      /* Frame-rate independent smooth interpolation */
      const baseLerpFactor = mode !== 'patrol' ? 0.055 : 0.085;
      const lerpFactorAdjusted = 1 - Math.pow(1 - baseLerpFactor, delta / 16.666);
      smoothX = firstFrame ? targetX : lerp(smoothX, targetX, lerpFactorAdjusted);
      smoothY = firstFrame ? targetY : lerp(smoothY, targetY, lerpFactorAdjusted);

      const horizontalVelocity = firstFrame ? 0 : smoothX - previousX;
      const tilt = clamp(horizontalVelocity * 2.6, -12, 12);

      previousX = smoothX;
      setPosition(smoothX, smoothY, tilt);
      scheduleAnimation();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: event.pointerType !== 'touch',
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const handleVisibility = () => {
      previousTime = performance.now();
      documentVisible = !document.hidden;

      if (documentVisible) {
        scheduleAnimation();
      } else if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    updateDevice();
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', updateDevice, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibility);
    scheduleAnimation();

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', updateDevice);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [
    edgeGap,
    orbitDuration,
    pauseOnInteraction,
    prefersReducedMotion,
    reverse,
    size,
    startDelay,
    topInset,
  ]);

  /* ── Activation Timer Cleanup ── */
  useEffect(() => {
    return () => {
      if (activationTimerRef.current !== null) {
        window.clearTimeout(activationTimerRef.current);
      }
    };
  }, []);

  const activate = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!interactive) {
      event.preventDefault();
      return;
    }

    setActivated(true);
    onActivate?.();
    window.dispatchEvent(
      new CustomEvent('cobalt-bot:activate', {
        detail: { source: 'floating-bot' },
      }),
    );

    if (activationTimerRef.current !== null) {
      window.clearTimeout(activationTimerRef.current);
    }

    activationTimerRef.current = window.setTimeout(() => {
      setActivated(false);
    }, 620);
  };

  const classes = ['cobalt-flybot', className].filter(Boolean).join(' ');
  const style: BotStyle = {
    '--bot-size': `${size}px`,
    '--bot-z': zIndex,
  };

  return (
    <button
      ref={rootRef}
      type="button"
      className={classes}
      style={style}
      aria-label={ariaLabel}
      aria-hidden={interactive ? undefined : true}
      tabIndex={interactive ? 0 : -1}
      data-ready="false"
      data-activated={activated ? 'true' : 'false'}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      data-section={currentMode}
      onClick={activate}
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
      onFocus={() => {
        focusedRef.current = true;
      }}
      onBlur={() => {
        focusedRef.current = false;
      }}
    >
      <span className="cobalt-flybot__aura" aria-hidden="true" />
      <span className="cobalt-flybot__shadow" aria-hidden="true" />

      {/* Scan beam for Services section */}
      <span className="cobalt-flybot__scan-beam" aria-hidden="true" />

      {/* Green scan line for About section */}
      <span className="cobalt-flybot__scan-line" aria-hidden="true" />

      {/* Money particle container for Pricing section */}
      <div
        ref={moneyContainerRef}
        className="cobalt-flybot__money-container"
        aria-hidden="true"
      />

      <span className="cobalt-flybot__hover-core" aria-hidden="true">
        <svg
          className="cobalt-flybot__svg"
          viewBox="0 0 70 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`${id}-shell`} x1="17" y1="13" x2="56" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="hsl(var(--primary-hue), 16%, 21%)" />
              <stop offset="0.48" stopColor="hsl(var(--primary-hue), 14%, 11%)" />
              <stop offset="1" stopColor="hsl(var(--primary-hue), 18%, 6%)" />
            </linearGradient>
            <linearGradient id={`${id}-face`} x1="23" y1="24" x2="50" y2="47" gradientUnits="userSpaceOnUse">
              <stop stopColor="hsla(var(--primary-hsl), 0.2)" />
              <stop offset="1" stopColor="hsla(var(--primary-hsl), 0.04)" />
            </linearGradient>
            <radialGradient id={`${id}-eye`} cx="0" cy="0" r="1" gradientTransform="translate(36 34) rotate(90) scale(12)">
              <stop stopColor="hsl(var(--primary-hue), 100%, 78%)" />
              <stop offset="0.42" stopColor="var(--primary)" />
              <stop offset="1" stopColor="hsl(var(--primary-hue), 100%, 34%)" />
            </radialGradient>
            {/* Green eye gradient for About section */}
            <radialGradient id={`${id}-eye-green`} cx="0" cy="0" r="1" gradientTransform="translate(36 34) rotate(90) scale(12)">
              <stop stopColor="hsl(140, 100%, 78%)" />
              <stop offset="0.42" stopColor="hsl(140, 80%, 50%)" />
              <stop offset="1" stopColor="hsl(140, 100%, 28%)" />
            </radialGradient>
            {/* Gold eye gradient for Process section */}
            <radialGradient id={`${id}-eye-gold`} cx="0" cy="0" r="1" gradientTransform="translate(36 34) rotate(90) scale(12)">
              <stop stopColor="hsl(40, 100%, 78%)" />
              <stop offset="0.42" stopColor="hsl(40, 100%, 50%)" />
              <stop offset="1" stopColor="hsl(40, 100%, 34%)" />
            </radialGradient>
          </defs>

          <g className="cobalt-flybot__antenna">
            <path d="M35 14V8" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="35" cy="6.5" r="2.5" fill="var(--primary)" />
          </g>

          <path
            className="cobalt-flybot__fin cobalt-flybot__fin--left"
            d="M13 29.5C8.8 30.4 7 33.3 7 36.5C7 39.7 8.8 42.6 13 43.5V29.5Z"
            fill="hsl(var(--primary-hue), 14%, 13%)"
            stroke="hsla(var(--primary-hsl), 0.5)"
          />
          <path
            className="cobalt-flybot__fin cobalt-flybot__fin--right"
            d="M57 29.5C61.2 30.4 63 33.3 63 36.5C63 39.7 61.2 42.6 57 43.5V29.5Z"
            fill="hsl(var(--primary-hue), 14%, 13%)"
            stroke="hsla(var(--primary-hsl), 0.5)"
          />

          <rect
            x="12.5"
            y="13.5"
            width="45"
            height="44"
            rx="18"
            fill={`url(#${id}-shell)`}
            stroke="hsla(var(--primary-hsl), 0.52)"
          />
          <path
            d="M20 21C24.2 16.9 29.2 15.8 35 15.8"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <rect
            x="18.5"
            y="21.5"
            width="33"
            height="28"
            rx="13"
            fill={`url(#${id}-face)`}
            stroke="hsla(var(--primary-hsl), 0.26)"
          />

          <g className="cobalt-flybot__eye">
            <circle cx="35" cy="35" r="9.5" fill="hsla(var(--primary-hsl), 0.08)" stroke="hsla(var(--primary-hsl), 0.35)" />
            <path
              className="cobalt-flybot__eye-arc"
              d="M39.8 29.8A7 7 0 1 0 39.8 40.2"
              stroke={`url(#${id}-eye)`}
              strokeWidth="3.1"
              strokeLinecap="round"
              style={{
                opacity: showHeart ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            />
            <circle
              className="cobalt-flybot__eye-pupil"
              cx="40"
              cy="35"
              r="2.6"
              fill={`url(#${id}-eye)`}
              style={{
                opacity: showHeart ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            />
            <circle
              cx="40.8"
              cy="34.1"
              r="0.75"
              fill="white"
              fillOpacity="0.9"
              style={{
                opacity: showHeart ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            />
            <path
              d="M40 38.3c-.2 0-.3-.1-.4-.2l-2.4-2.4c-.9-.9-.9-2.3 0-3.2.9-.9 2.3-.9 3.2 0l.4.4.4-.4c.9-.9 2.3-.9 3.2 0 .9.9.9 2.3 0 3.2l-2.4 2.4c-.1.1-.2.2-.4.2z"
              fill="hsl(350, 100%, 62%)"
              style={{
                opacity: showHeart ? 1 : 0,
                transform: showHeart ? 'scale(1.5)' : 'scale(0)',
                transformOrigin: '40px 35px',
                transition: 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease',
              }}
            />
          </g>

          <path
            className="cobalt-flybot__vent"
            d="M29 53.5H41"
            stroke="hsla(var(--primary-hsl), 0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="cobalt-flybot__thruster"
            d="M29 58H41L38.7 63.2C38.2 64.3 37.1 65 35.9 65H34.1C32.9 65 31.8 64.3 31.3 63.2L29 58Z"
            fill="hsla(var(--primary-hsl), 0.28)"
          />
          <path
            className="cobalt-flybot__thruster-light"
            d="M32 59H38L36.7 64.4C36.5 65.3 35.7 66 34.8 66C33.9 66 33.2 65.4 33 64.6L32 59Z"
            fill="var(--primary)"
          />
        </svg>
      </span>

      <span className="cobalt-flybot__activation-ring" aria-hidden="true" />
    </button>
  );
}
