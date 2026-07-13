import { useCallback, useEffect, useRef, useState } from 'react';
import { usePointerSpotlight } from '../hooks/usePointerSpotlight';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Pricing.css';

/* ── Types ── */

type BillingCycle = 'monthly' | 'annual';

interface PriceInfo {
  amount: string;
  period: string;
}

interface PricingTier {
  monthly: PriceInfo;
  annual: PriceInfo;
  saveBadge: string;
}

interface FeatureItem {
  text: string;
}

interface PricingCardData {
  title: string;
  pricing: PricingTier;
  features: FeatureItem[];
  ctaLabel: string;
  ctaHref: string;
  ctaStyle: 'btn-primary' | 'btn-secondary';
  featured: boolean;
  popularBadge?: string;
}

/* ── Static Data ── */

const WHATSAPP_LINK = 'https://wa.me/96407703198849';

const pricingCards: PricingCardData[] = [
  {
    title: 'صفحة Bio Link',
    pricing: {
      monthly: { amount: '20,000 IQD', period: 'شهرياً' },
      annual: { amount: '200,000 IQD', period: 'سنوياً' },
      saveBadge: 'وفّر 40,000 IQD',
    },
    features: [
      { text: 'صفحة رقمية احترافية' },
      { text: 'رابط مخصص (cobalt.autos/اسمك)' },
      { text: 'حتى 5 تحديثات مجانية/شهرياً' },
      { text: 'متوافقة مع جميع الأجهزة' },
    ],
    ctaLabel: 'ابدأ الآن',
    ctaHref: WHATSAPP_LINK,
    ctaStyle: 'btn-secondary',
    featured: false,
  },
  {
    title: 'قائمة QR ذكية',
    pricing: {
      monthly: { amount: '40,000 IQD', period: 'شهرياً' },
      annual: { amount: '400,000 IQD', period: 'سنوياً' },
      saveBadge: 'وفّر 80,000 IQD',
    },
    features: [
      { text: 'كل مميزات Bio Link' },
      { text: 'صفحة قائمة طعام /menu' },
      { text: 'QR كود مطبوع بتصميم مخصص' },
      { text: 'حتى 5 تحديثات مجانية/شهرياً' },
    ],
    ctaLabel: 'ابدأ الآن',
    ctaHref: WHATSAPP_LINK,
    ctaStyle: 'btn-primary',
    featured: true,
    popularBadge: 'الأكثر شيوعاً',
  },
];

/* ── Sub-components ── */

interface ToggleProps {
  billing: BillingCycle;
  onToggle: (cycle: BillingCycle) => void;
}

function BillingToggle({ billing, onToggle }: ToggleProps) {
  return (
    <div className="pricing-toggle" role="group" aria-label="اختيار مدة الاشتراك">
      <div className={`pricing-toggle-indicator pricing-toggle-indicator--${billing}`} aria-hidden="true" />
      <button
        type="button"
        className={`pricing-toggle-option${billing === 'monthly' ? ' pricing-toggle-option--active' : ''}`}
        aria-pressed={billing === 'monthly'}
        onClick={() => onToggle('monthly')}
      >
        شهرياً
      </button>
      <button
        type="button"
        className={`pricing-toggle-option${billing === 'annual' ? ' pricing-toggle-option--active' : ''}`}
        aria-pressed={billing === 'annual'}
        onClick={() => onToggle('annual')}
      >
        سنوياً
      </button>
    </div>
  );
}

interface CardProps {
  data: PricingCardData;
  billing: BillingCycle;
  isFading: boolean;
  isBouncing: boolean;
}

function PricingCard({ data, billing, isFading, isBouncing }: CardProps) {
  const currentPrice = data.pricing[billing];
  const showSaveBadge = billing === 'annual';
  const spotlight = usePointerSpotlight<HTMLDivElement>();

  const cardContent = (
    <div
      className="card spotlight-card"
      style={spotlight.style}
      {...spotlight.handlers}
    >
      <div className="pricing-card-content">
        <h3 className="pricing-card-title">{data.title}</h3>

        <div className="pricing-price-block">
          <div
            className={`pricing-price-animated${isFading ? ' pricing-price-fading' : ''}`}
          >
            <span className={`pricing-price ltr-text${isBouncing ? ' pricing-price-bounce' : ''}`}>
              {currentPrice.amount}
            </span>
            <span>/{currentPrice.period}</span>
          </div>

          {showSaveBadge && (
            <div className="pricing-save-badge">
              {data.pricing.saveBadge}
            </div>
          )}
        </div>

        <ul className="pricing-features">
          {data.features.map((feature) => (
            <li key={feature.text} className="pricing-feature-item">
              <span className="pricing-feature-check" aria-hidden="true">✓</span>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>

        <div className="pricing-cta">
          <a
            href={data.ctaHref}
            className={`btn ${data.ctaStyle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.ctaLabel}
          </a>
        </div>
      </div>
    </div>
  );

  if (data.featured) {
    return (
      <div className="pricing-card">
        <div className="pricing-card-featured-wrapper">
          {data.popularBadge && (
            <span className="pricing-popular-badge">{data.popularBadge}</span>
          )}
          {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-card">
      <div className="accent-border-box">
        {cardContent}
      </div>
    </div>
  );
}

/* ── Main Component ── */

function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>('annual');
  const [isFading, setIsFading] = useState<boolean>(false);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);
  const sectionRef = useScrollReveal();
  const animationTimerRef = useRef<number | null>(null);
  const bounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }

      if (bounceTimerRef.current !== null) {
        window.clearTimeout(bounceTimerRef.current);
      }
    };
  }, []);

  const handleToggle = useCallback(
    (cycle: BillingCycle) => {
      if (cycle === billing) return;

      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }

      if (bounceTimerRef.current !== null) {
        window.clearTimeout(bounceTimerRef.current);
      }

      setIsFading(true);
      animationTimerRef.current = window.setTimeout(() => {
        setBilling(cycle);
        setIsFading(false);
        setIsBouncing(true);
        bounceTimerRef.current = window.setTimeout(() => setIsBouncing(false), 400);
      }, 200);
    },
    [billing]
  );

  return (
    <section id="pricing" className="section reveal" ref={sectionRef}>
      <div className="section-divider-line" aria-hidden="true" />
      <div className="container">
        <header className="pricing-header">
          <span className="badge">الأسعار</span>
          <h2>اختر خطتك</h2>
          <BillingToggle billing={billing} onToggle={handleToggle} />
        </header>

        <div className="pricing-grid">
          {pricingCards.map((card) => (
            <PricingCard
              key={card.title}
              data={card}
              billing={billing}
              isFading={isFading}
              isBouncing={isBouncing}
            />
          ))}
        </div>

        <div className="pricing-addon">
          <p className="pricing-addon-title">
            إضافة: لوحة تحكم ذاتية (<span className="ltr-text">+49,000 IQD</span>/سنوياً)
          </p>
          <p className="pricing-addon-description">
            عدّل أسعارك ومنتجاتك بنفسك — بدون انتظار. متاحة للاشتراك السنوي فقط.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
