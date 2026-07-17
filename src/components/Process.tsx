import './Process.css';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const STEPS: ProcessStep[] = [
  {
    number: '1',
    title: 'نحدد الهدف',
    description: 'نسمع لفكرتك، جمهورك، والنتيجة التي تريد الوصول لها.',
  },
  {
    number: '2',
    title: 'نرتب المحتوى',
    description: 'نحوّل معلوماتك إلى رسالة واضحة وهيكل سهل التصفح.',
  },
  {
    number: '3',
    title: 'نصمم ونبني',
    description: 'نصنع تجربة رقمية متناسقة مع هوية عملك وأهدافه.',
  },
  {
    number: '4',
    title: 'نراجع ونطلق',
    description: 'نراجع التفاصيل معك ثم نجهّز المشروع للمشاركة بثقة.',
  },
];

interface StepIconProps {
  index: number;
}

function StepIcon({ index }: StepIconProps) {
  if (index === 0) {
    return (
      <span className="process-icon-wrapper process-icon-msg">
        <svg viewBox="0 0 24 24" className="base-icon" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      </span>
    );
  }

  if (index === 1) {
    return (
      <span className="process-icon-wrapper process-icon-web">
        <svg viewBox="0 0 24 24" className="base-icon" aria-hidden="true">
          <rect x="2" y="3" width="20" height="18" rx="2" className="web-frame" />
          <line x1="2" y1="8" x2="22" y2="8" className="web-header-line" />
          <circle cx="5" cy="5.5" r="0.7" className="web-dot" />
          <circle cx="8" cy="5.5" r="0.7" className="web-dot" />
          <rect x="5" y="11" width="6" height="7" rx="1" className="web-block web-block-left" />
          <rect x="13" y="11" width="6" height="3" rx="0.5" className="web-block web-block-top-right" />
          <rect x="13" y="16" width="6" height="2" rx="0.5" className="web-block web-block-bot-right" />
        </svg>
      </span>
    );
  }

  if (index === 2) {
    return (
      <span className="process-icon-wrapper process-icon-web">
        <svg viewBox="0 0 24 24" className="base-icon" aria-hidden="true">
          <path d="M4 4h16v16H4z" />
          <path d="M8 8h8M8 12h5M8 16h7" />
        </svg>
      </span>
    );
  }

  return (
    <span className="process-icon-wrapper process-icon-rocket">
      <svg viewBox="0 0 24 24" className="base-icon rocket-svg-element" aria-hidden="true">
        <path d="M12 2c.5 0 2.5 2.5 3 4.5.5 2 0 6.5-1.5 8.5C12 17 12 21 12 21s0-4-1.5-6c-1.5-2-2-6.5-1.5-8.5.5-2 2.5-4.5 3-4.5z" />
        <path d="M9 12c-1-1-2.5-1.5-3.5-1.5s-1.5.5-1.5.5 1 2 2.5 3 2.5.5 2.5.5" />
        <path d="M15 12c1-1 2.5-1.5 3.5-1.5s1.5.5 1.5.5-1 2-2.5 3-2.5.5-2.5.5" />
        <circle cx="12" cy="9" r="1.2" fill="currentColor" />
      </svg>
    </span>
  );
}

function Process() {
  return (
    <section id="process" className="process section">
      <div className="section-divider-line" aria-hidden="true" />
      <div className="process__ambient" aria-hidden="true" />
      <div className="process__grid-bg" aria-hidden="true" />

      <div className="container process__container">
        <div className="process-header">
          <span className="badge">العملية</span>
          <h2>من الفكرة إلى الإطلاق</h2>
        </div>

        <div className="process-steps-wrap">
          <div className="process-steps__track" aria-hidden="true">
            <span className="process-steps__track-fill" />
          </div>

          <ol className="process-steps">
            {STEPS.map((step, index) => {
              return (
                <li
                  key={step.number}
                  className="process-step"
                >
                  <div className="process-step__surface">
                    <div className="process-step__top">
                      <div className="process-step-circle" aria-hidden="true">
                        <span>{step.number}</span>
                      </div>
                      <span className="process-step__icon" aria-hidden="true">
                        <StepIcon index={index} />
                      </span>
                    </div>

                    <div className="process-step-content">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
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
