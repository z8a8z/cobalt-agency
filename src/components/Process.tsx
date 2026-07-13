import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Process.css';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const STEPS: ProcessStep[] = [
  {
    number: '1',
    title: 'تواصل معنا',
    description: 'كلمنا على واتساب وخبرنا عن عملك.',
  },
  {
    number: '2',
    title: 'نبني صفحتك',
    description: 'نصمم ونبني صفحتك خلال 48 ساعة.',
  },
  {
    number: '3',
    title: 'انطلق',
    description: 'صفحتك جاهزة — شاركها مع زبائنك.',
  },
];

const DELAY_CLASSES = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'] as const;

interface StepIconProps {
  index: number;
  isHovered: boolean;
}

// Enhanced Custom SVGs for interactive steps
function StepIcon({ index, isHovered }: StepIconProps) {
  if (index === 0) {
    return (
      <span className={`process-icon-wrapper process-icon-msg ${isHovered ? 'animate-msg-scale' : ''}`}>
        <svg viewBox="0 0 24 24" className="base-icon" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h8M8 14h5" />
        </svg>
        {isHovered && (
          <div className="icon-particles">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="particle-dot" style={{ '--i': i } as CSSProperties} />
            ))}
          </div>
        )}
      </span>
    );
  }

  if (index === 1) {
    return (
      <span className={`process-icon-wrapper process-icon-web ${isHovered ? 'animate-web-build' : ''}`}>
        <svg viewBox="0 0 24 24" className="base-icon" aria-hidden="true">
          {/* Browser frame */}
          <rect x="2" y="3" width="20" height="18" rx="2" className="web-frame" />
          <line x1="2" y1="8" x2="22" y2="8" className="web-header-line" />
          <circle cx="5" cy="5.5" r="0.7" className="web-dot" />
          <circle cx="8" cy="5.5" r="0.7" className="web-dot" />
          {/* Grid Blocks that build on hover */}
          <rect x="5" y="11" width="6" height="7" rx="1" className="web-block web-block-left" />
          <rect x="13" y="11" width="6" height="3" rx="0.5" className="web-block web-block-top-right" />
          <rect x="13" y="16" width="6" height="2" rx="0.5" className="web-block web-block-bot-right" />
        </svg>
        {isHovered && (
          <div className="icon-particles">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="particle-spark" style={{ '--i': i } as CSSProperties} />
            ))}
          </div>
        )}
      </span>
    );
  }

  // Rocket step: local launch & explosion
  return (
    <span className={`process-icon-wrapper process-icon-rocket ${isHovered ? 'animate-rocket-launch' : ''}`}>
      <svg viewBox="0 0 24 24" className="base-icon rocket-svg-element" aria-hidden="true">
        <path d="M12 2c.5 0 2.5 2.5 3 4.5.5 2 0 6.5-1.5 8.5C12 17 12 21 12 21s0-4-1.5-6c-1.5-2-2-6.5-1.5-8.5.5-2 2.5-4.5 3-4.5z" />
        <path d="M9 12c-1-1-2.5-1.5-3.5-1.5s-1.5.5-1.5.5 1 2 2.5 3 2.5.5 2.5.5" />
        <path d="M15 12c1-1 2.5-1.5 3.5-1.5s1.5.5 1.5.5-1 2-2.5 3-2.5.5-2.5.5" />
        <circle cx="12" cy="9" r="1.2" fill="currentColor" />
      </svg>
      {isHovered && (
        <>
          <div className="icon-smoke">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="smoke-puff" style={{ '--i': i } as CSSProperties} />
            ))}
          </div>
          <div className="icon-particles">
            {[...Array(16)].map((_, i) => (
              <span key={i} className="particle-rocket-spark" style={{ '--i': i } as CSSProperties} />
            ))}
          </div>
        </>
      )}
    </span>
  );
}

function Process() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const step1Ref = useScrollReveal<HTMLLIElement>();
  const step2Ref = useScrollReveal<HTMLLIElement>();
  const step3Ref = useScrollReveal<HTMLLIElement>();
  const stepRefs = [step1Ref, step2Ref, step3Ref];
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerCardRef = useRef<HTMLLIElement | null>(null);
  const pointerBoundsRef = useRef<DOMRect | null>(null);
  const pointerPositionRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    return () => {
      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
    };
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLLIElement>) => {
    if (event.pointerType === 'touch') return;

    const card = event.currentTarget;
    const rect = pointerCardRef.current === card && pointerBoundsRef.current
      ? pointerBoundsRef.current
      : card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    pointerCardRef.current = card;
    pointerBoundsRef.current = rect;
    pointerPositionRef.current = { x, y };

    if (pointerFrameRef.current !== null) return;

    pointerFrameRef.current = window.requestAnimationFrame(() => {
      const activeCard = pointerCardRef.current;
      const pointer = pointerPositionRef.current;

      if (activeCard) {
        activeCard.style.setProperty('--process-pointer-x', `${pointer.x * 100}%`);
        activeCard.style.setProperty('--process-pointer-y', `${pointer.y * 100}%`);
        activeCard.style.setProperty('--process-rotate-x', `${(0.5 - pointer.y) * 8}deg`);
        activeCard.style.setProperty('--process-rotate-y', `${(pointer.x - 0.5) * 8}deg`);
      }

      pointerFrameRef.current = null;
    });
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLLIElement>) => {
    const card = event.currentTarget;

    if (pointerFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }

    pointerCardRef.current = null;
    pointerBoundsRef.current = null;
    card.style.setProperty('--process-pointer-x', '50%');
    card.style.setProperty('--process-pointer-y', '50%');
    card.style.setProperty('--process-rotate-x', '0deg');
    card.style.setProperty('--process-rotate-y', '0deg');

    setHoveredStep(null);
  };

  return (
    <section id="process" className="process section">
      <div className="section-divider-line" aria-hidden="true" />
      <div className="process__ambient" aria-hidden="true" />
      <div className="process__grid-bg" aria-hidden="true" />

      <div className="container process__container">
        <div className="process-header reveal" ref={headerRef}>
          <span className="badge">العملية</span>
          <h2>3 خطوات وتنطلق</h2>
        </div>

        <div className="process-steps-wrap">
          <div className="process-steps__track" aria-hidden="true">
            <span className="process-steps__track-fill" />
          </div>

          <ol className="process-steps">
            {STEPS.map((step, index) => {
              const isHovered = hoveredStep === index;

              return (
                <li
                  key={step.number}
                  ref={stepRefs[index]}
                  className={`process-step process-step--active reveal ${DELAY_CLASSES[index]}`}
                  onPointerMove={handlePointerMove}
                  onPointerLeave={handlePointerLeave}
                  onMouseEnter={() => setHoveredStep(index)}
                >
                  <div className="process-step__surface">
                    <div className="process-step__top">
                      <div className="process-step-circle" aria-hidden="true">
                        <span>{step.number}</span>
                      </div>
                      <span className="process-step__icon" aria-hidden="true">
                        <StepIcon index={index} isHovered={isHovered} />
                      </span>
                    </div>

                    <div className="process-step-content">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>

                    <span className="process-step__edge" aria-hidden="true" />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Process;
