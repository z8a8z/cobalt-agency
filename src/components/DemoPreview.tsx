import { useScrollReveal } from '../hooks/useScrollReveal';
import './DemoPreview.css';

const PREVIEWS = [
  { tag: '01', title: 'موقع إلكتروني', copy: 'صفحات تعريف، خدمات، وتواصل تعمل معاً كواجهة عملك الرئيسية.' },
  { tag: '02', title: 'معرض أعمال', copy: 'مشاريع مرتبة بصرياً لتخلي أعمالك تتكلم عنك.' },
  { tag: '03', title: 'سيرة ذاتية رقمية', copy: 'خبرتك وإنجازاتك في رابط احترافي واحد.' },
  { tag: '04', title: 'صفحة تسجيل', copy: 'تفاصيل البرنامج وخطوة تسجيل واضحة بدون تشتيت.' },
  { tag: '05', title: 'بروفايل شركة', copy: 'تعريف رقمي مختصر وجاهز للفرص والاجتماعات.' },
];

function DemoPreview() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="demo" className="demo-preview section reveal" ref={sectionRef}>
      <div className="section-divider-line" aria-hidden="true" />
      <div className="container">
        <header className="demo-preview__header">
          <span className="badge">مصمم حسب الهدف</span>
          <h2>مو قالب واحد لكل المشاريع</h2>
          <p>نختار شكل التجربة وترتيب المحتوى حسب ما يحتاجه الزائر أن يفهمه أو يفعله.</p>
        </header>

        <div className="demo-preview__grid">
          {PREVIEWS.map((preview) => (
            <article key={preview.tag} className="demo-preview__card">
              <div className="demo-preview__frame" aria-hidden="true">
                <div className="demo-preview__frame-bar"><i /><i /><i /></div>
                <div className="demo-preview__frame-body">
                  <span /><strong /><em /><em />
                  <div><b /><b /><b /></div>
                </div>
              </div>
              <div className="demo-preview__copy">
                <span>{preview.tag}</span>
                <h3>{preview.title}</h3>
                <p>{preview.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DemoPreview;
