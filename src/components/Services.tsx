import { useScrollReveal } from '../hooks/useScrollReveal';
import './Services.css';

type ServiceKind = 'website' | 'portfolio' | 'cv' | 'enrollment' | 'profile';

interface Service {
  description: string;
  kind: ServiceKind;
  label: string;
  title: string;
}

const SERVICES: Service[] = [
  {
    kind: 'website',
    label: 'موقع متكامل',
    title: 'موقع إلكتروني متكامل',
    description: 'موقع متكامل يعرّف بخدمتك، يوضح قيمتك، ويعطي العميل طريقاً واضحاً للتواصل معك.',
  },
  {
    kind: 'portfolio',
    label: 'عرض أعمالك',
    title: 'معرض أعمال إبداعي',
    description: 'معرض أعمال بصري يضع مشاريعك في الواجهة ويجعل جودة شغلك واضحة من أول زيارة.',
  },
  {
    kind: 'cv',
    label: 'هويتك المهنية',
    title: 'سيرة ذاتية رقمية',
    description: 'سيرة ذاتية رقمية منظمة تعرض خبرتك، مهاراتك، وإنجازاتك برابط واحد سهل المشاركة.',
  },
  {
    kind: 'enrollment',
    label: 'تحويل الاهتمام إلى تسجيل',
    title: 'صفحة تسجيل دورة أو ورشة',
    description: 'صفحة مركزة لعرض تفاصيل الدورة أو الورشة واستقبال طلبات التسجيل بطريقة واضحة وسلسة.',
  },
  {
    kind: 'profile',
    label: 'تعريف مؤسسي',
    title: 'بروفايل شركة رقمي',
    description: 'بروفايل شركة رقمي يقدّم خدماتك، قصتك، وقدرات فريقك بشكل يليق بالاجتماعات والفرص الجديدة.',
  },
];

function ServiceIcon({ kind }: { kind: ServiceKind }) {
  const paths: Record<ServiceKind, React.ReactNode> = {
    website: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18M7 6h.01M10 6h.01M7 12h5M7 15h8" /></>,
    portfolio: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m7 15 3-3 2 2 3-4 3 5M7 8h.01" /></>,
    cv: <><path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h6M8 17h4" /></>,
    enrollment: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h4M8 16h3M15 15l1.5 1.5L20 13" /></>,
    profile: <><circle cx="12" cy="8" r="3" /><path d="M5 21v-1a7 7 0 0 1 14 0v1M4 4h16v16H4z" /></>,
  };

  return (
    <svg className="service-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}

function ServiceVisual({ kind }: { kind: ServiceKind }) {
  return (
    <div className={`service-visual service-visual--${kind}`} aria-hidden="true">
      <div className="service-visual__topbar"><i /><i /><i /></div>
      <div className="service-visual__body">
        <span className="service-visual__eyebrow" />
        <span className="service-visual__title" />
        <span className="service-visual__copy" />
        <span className="service-visual__copy service-visual__copy--short" />
        <div className="service-visual__content">
          <span /><span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function Services() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="services" className="section services reveal" ref={sectionRef}>
      <div className="section-divider-line" aria-hidden="true" />
      <div className="container">
        <div className="services-header">
          <span className="badge">ماذا نقدم</span>
          <h2>حلول رقمية تُبنى حول هدفك</h2>
          <p>من أول انطباع إلى أول تواصل، نبني صفحات احترافية تخدم العمل الذي تريد عرضه.</p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <article key={service.kind} className="service-card accent-border-top">
              <div className="service-card-content">
                <div className="service-card-header">
                  <ServiceIcon kind={service.kind} />
                  <span className="service-card-subtitle">{service.label}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <ServiceVisual kind={service.kind} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
