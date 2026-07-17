import { useScrollReveal } from '../hooks/useScrollReveal';
import './Pricing.css';

interface ProjectType {
  description: string;
  featured?: boolean;
  includes: string[];
  title: string;
}

const WHATSAPP_LINK = 'https://wa.me/96407703198849?text=مرحباً، أريد عرض سعر لمشروع رقمي.';

const PROJECT_TYPES: ProjectType[] = [
  {
    title: 'موقع إلكتروني متكامل',
    featured: true,
    description: 'للأعمال التي تحتاج موقعاً متكاملاً يحوّل التعريف بالخدمة إلى طلب تواصل واضح.',
    includes: ['هيكل صفحات يناسب أهداف العمل', 'تصميم متجاوب للكمبيوتر والموبايل', 'مسار تواصل واضح للزوار'],
  },
  {
    title: 'معرض أعمال إبداعي',
    description: 'للمبدعين والفرق التي تريد عرض المشاريع بأسلوب يعكس جودة عملها.',
    includes: ['عرض مشاريع منظم وبصري', 'صفحات دراسات حالة عند الحاجة', 'رابط جاهز للمشاركة مع العملاء'],
  },
  {
    title: 'سيرة ذاتية رقمية',
    description: 'للمحترفين الذين يريدون سيرة ذاتية رقمية أبسط من ملف PDF وأسهل في التحديث.',
    includes: ['خبرات ومهارات مرتبة', 'عرض أعمال أو إنجازات مختارة', 'بيانات تواصل مباشرة'],
  },
  {
    title: 'صفحة تسجيل دورة أو ورشة',
    description: 'للمدربين والجهات التعليمية التي تريد شرح العرض واستقبال التسجيلات بوضوح.',
    includes: ['تفاصيل البرنامج والمواعيد', 'معلومات تناسب القرار', 'نموذج أو مسار للتسجيل'],
  },
  {
    title: 'بروفايل شركة رقمي',
    description: 'للشركات التي تحتاج تعريفاً مؤسسياً حديثاً للاجتماعات، الشراكات، والفرص الجديدة.',
    includes: ['قصة الشركة وخدماتها', 'عرض القدرات والفريق', 'نسخة سهلة الإرسال والمشاركة'],
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m4.5 10.5 3.25 3.25L15.75 6" />
    </svg>
  );
}

function Pricing() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="pricing" className="section reveal pricing" ref={sectionRef}>
      <div className="section-divider-line" aria-hidden="true" />
      <div className="container">
        <header className="pricing__header">
          <span className="badge">نطاق المشروع</span>
          <h2>كل مشروع له احتياج مختلف</h2>
          <p>نحدد السعر والمدة بعد فهم المحتوى، عدد الصفحات، والوظائف التي يحتاجها مشروعك. أخبرنا بفكرتك لنجهز لك عرضاً واضحاً.</p>
        </header>

        <div className="pricing__grid">
          {PROJECT_TYPES.map((project) => (
            <article key={project.title} className={`pricing-plan${project.featured ? ' pricing-plan--featured' : ''}`}>
              {project.featured && <span className="pricing-plan__badge">الخيار الأشمل</span>}
              <div className="pricing-plan__header">
                <p className="pricing-plan__eyebrow">مشروع مخصص</p>
                <h3>{project.title}</h3>
                <p className="pricing-plan__description">{project.description}</p>
              </div>
              <ul className="pricing-plan__features">
                {project.includes.map((item) => (
                  <li key={item}>
                    <span className="pricing-plan__check"><CheckIcon /></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href={WHATSAPP_LINK} className={`btn ${project.featured ? 'btn-primary' : 'btn-secondary'} pricing-plan__cta`} target="_blank" rel="noopener noreferrer">
                اطلب عرض سعر
              </a>
            </article>
          ))}
        </div>
        <p className="pricing__note"><span aria-hidden="true">•</span> عرض السعر يوضح نطاق العمل، ما يتضمنه المشروع، والمدة المقترحة قبل البدء.</p>
      </div>
    </section>
  );
}

export default Pricing;
