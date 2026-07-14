import { useScrollReveal } from '../hooks/useScrollReveal';
import './Pricing.css';

interface PricingPackage {
  description: string;
  featured?: boolean;
  features: string[];
  oneTimeAmount: string;
  oneTimeNote: string;
  renewalAmount: string;
  title: string;
}

const WHATSAPP_LINK = 'https://wa.me/96407703198849';

const PRICING_PACKAGES: PricingPackage[] = [
  {
    title: 'باقة بايو لينك',
    description: 'تحصل رابط يفتح صفحة جميلة تكدر تصممها بكيفك، بيها كل حساباتك ومواقعك، يوصلها زبونك بثانية.',
    oneTimeAmount: '100,000',
    oneTimeNote: 'دفعة وحدة تشمل سنة كاملة دعم فني وحق تعديل.',
    renewalAmount: '25,000',
    features: [
      'صفحة مصممة على ذوقك وباسم عملك.',
      'كل حساباتك وروابطك بمكان واحد.',
      'دعم فني وتعديلات خلال أول سنة كاملة.',
    ],
  },
  {
    title: 'باقة القائمة الرقمية (QR)',
    description: 'تحصل QR يفتح قائمة ذكية تكدر تصممها بكيفك، بيها كل آيتماتك، يوصلها زبونك بثانية.',
    oneTimeAmount: '200,000',
    oneTimeNote: 'دفعة وحدة تشمل باقة البايو لينك هدية وسنة كاملة دعم فني وحق تعديل.',
    renewalAmount: '50,000',
    featured: true,
    features: [
      'قائمة رقمية ذكية لكل آيتماتك.',
      'QR جاهز يوصل زبونك للقائمة بثانية.',
      'باقة البايو لينك هدية وياها.',
      'دعم فني وتعديلات خلال أول سنة كاملة.',
    ],
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m4.5 10.5 3.25 3.25L15.75 6" />
    </svg>
  );
}

interface PricingCardProps {
  plan: PricingPackage;
}

function PricingCard({ plan }: PricingCardProps) {
  return (
    <article className={`pricing-plan${plan.featured ? ' pricing-plan--featured' : ''}`}>
      {plan.featured && <span className="pricing-plan__badge">يشمل بايو لينك هدية</span>}

      <div className="pricing-plan__header">
        <p className="pricing-plan__eyebrow">حل رقمي متكامل</p>
        <h3>{plan.title}</h3>
        <p className="pricing-plan__description">{plan.description}</p>
      </div>

      <div className="pricing-plan__price-block">
        <p className="pricing-plan__price-label">{plan.oneTimeNote}</p>
        <p className="pricing-plan__price">
          <span className="ltr-text">{plan.oneTimeAmount}</span>
          <span>د.ع</span>
        </p>
        <p className="pricing-plan__payment">دفعة وحدة</p>
      </div>

      <ul className="pricing-plan__features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <span className="pricing-plan__check"><CheckIcon /></span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="pricing-plan__renewal">
        <div>
          <p className="pricing-plan__renewal-label">تجديد سنوي بعد السنة الأولى</p>
          <p className="pricing-plan__renewal-copy">الصيانة، التعديلات والدعم لمدة سنة كاملة.</p>
        </div>
        <p className="pricing-plan__renewal-price">
          <span className="ltr-text">{plan.renewalAmount}</span>
          <span>د.ع</span>
        </p>
      </div>

      <a
        href={WHATSAPP_LINK}
        className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} pricing-plan__cta`}
        target="_blank"
        rel="noopener noreferrer"
      >
        ابدأ الآن
      </a>
    </article>
  );
}

function Pricing() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="pricing" className="section reveal pricing" ref={sectionRef}>
      <div className="section-divider-line" aria-hidden="true" />
      <div className="container">
        <header className="pricing__header">
          <span className="badge">الأسعار</span>
          <h2>باقة واضحة، ملكية كاملة</h2>
          <p>تدفع مرة وحدة، وتبقى صفحتك ملك إلك. بعد السنة الأولى تختار تجدد الدعم فقط إذا تحتاجه.</p>
        </header>

        <div className="pricing__grid">
          {PRICING_PACKAGES.map((plan) => (
            <PricingCard key={plan.title} plan={plan} />
          ))}
        </div>

        <p className="pricing__note">
          <span aria-hidden="true">•</span>
          صفحتك تبقى شغالة دائماً، حتى لو تأخر التجديد.
        </p>
      </div>
    </section>
  );
}

export default Pricing;
