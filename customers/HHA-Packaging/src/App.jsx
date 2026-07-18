import { useEffect, useState } from "react";
import logo from "./assets/hha-logo.png";

const solutions = [
  { number: "01", title: "الشيبس والوجبات الخفيفة", text: "سلفان من طبقتين بطباعة عالية الوضوح وحماية مناسبة للمنتج." },
  { number: "02", title: "الألبان والزيوت", text: "ملصقات وأغطية وأختام للعبوات، مع حلول مناسبة للزيوت النباتية والعطرية." },
  { number: "03", title: "القهوة والشاي", text: "أغلفة للمشروبات الحبيبية وأكياس الشاي والقهوة تحفظ النكهة والهوية." },
  { number: "04", title: "الحلويات والمثلجات", text: "أغلفة للكيك والشوكولاتة والسكاكر والآيس كريم والمخاريط." },
  { number: "05", title: "التوابل والمحليات", text: "ملصقات وأغلفة لعبوات الملح والسكر والبهارات بمقاسات متعددة." },
  { number: "06", title: "الوجبات السريعة", text: "أغلفة عملية للبرجر والسندويشات والمقليات مصممة لسرعة الخدمة." },
];

const materials = [
  ["BOPP Shiny", "20 / 25 / 30"],
  ["BOPP Matt", "20 / 25 / 30"],
  ["BOPP Metalized", "20"],
  ["PET Shiny", "12 / 15 / 20"],
  ["PET Matt", "12 / 15 / 20"],
  ["CPP Shiny", "30 / 40"],
];

const process = [
  { step: "01", title: "نفهم المنتج", text: "نراجع طبيعة المنتج، ظروف التخزين، ومتطلبات خط الإنتاج." },
  { step: "02", title: "نختار التركيبة", text: "نقترح المادة والسماكة وعدد طبقات التصفيح الأنسب." },
  { step: "03", title: "نطبع ونطابق", text: "طباعة فلكسو حتى 8 ألوان مع مطابقة دقيقة للهوية البصرية." },
  { step: "04", title: "نقص ونسلّم", text: "اتجاه طباعة ولف مضبوط، ورولات جاهزة للعمل مباشرة." },
];

function Icon({ name, size = 22 }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
    print: <><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></>,
    cut: <><circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="m8.7 8.3 12.3 6.2"/><path d="m8.7 15.7 12.3-6.2"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></>,
    map: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "مرحباً HHA Packaging، أود طلب استشارة تغليف.",
      `الاسم: ${form.get("name")}`,
      `الشركة: ${form.get("company")}`,
      `الهاتف: ${form.get("phone")}`,
      `تفاصيل الطلب: ${form.get("message") || "سأشارك التفاصيل عند التواصل"}`,
    ].join("\n");
    window.open(`https://wa.me/9647701302524?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site">
      <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
      <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container nav-wrap">
          <a className="brand" href="#top" aria-label="HHA Packaging - الصفحة الرئيسية" onClick={closeMenu}>
            <img src={logo} width="132" height="73" alt="HHA Packaging" />
            <span><b>HHA PACKAGING</b><small>عضو في مجموعة HHA Group</small></span>
          </a>
          <nav className={`nav ${menuOpen ? "is-open" : ""}`} aria-label="التنقل الرئيسي">
            <a href="#about" onClick={closeMenu}>عن الشركة</a>
            <a href="#solutions" onClick={closeMenu}>حلولنا</a>
            <a href="#technology" onClick={closeMenu}>التقنيات</a>
            <a href="#quality" onClick={closeMenu}>الجودة</a>
            <a className="nav-cta" href="#contact" onClick={closeMenu}>ابدأ طلبك <Icon name="arrow" size={18} /></a>
          </nav>
          <button className="menu-button" type="button" aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <p className="eyebrow"><span /> حلول تغليف مرن من كركوك إلى العراق والمنطقة</p>
              <h1>نحوّل جودة منتجك<br />إلى حضور <em>يُرى.</em></h1>
              <p className="hero-lead">من الطباعة الفلكسوغرافية والتصفيح متعدد الطبقات إلى القص والتجهيز النهائي؛ نمنح منتجك غلافاً يحميه ويُبرز علامتك بدقة.</p>
              <div className="hero-actions">
                <a className="button primary" href="#contact">اطلب استشارة فنية <Icon name="arrow" size={19} /></a>
                <a className="button text-button" href="tel:+9647701302524"><Icon name="phone" size={19} /> +964 770 130 25 24</a>
              </div>
              <div className="hero-proof" aria-label="مؤشرات الإنتاج">
                <div><strong>8</strong><span>ألوان طباعة</span></div>
                <div><strong>3</strong><span>طبقات تصفيح</span></div>
                <div><strong>7–14</strong><span>يوماً للتجهيز</span></div>
              </div>
            </div>

            <div className="hero-visual" aria-label="رسم تجريدي لرول التغليف المرن">
              <div className="roll-scene">
                <div className="roll-shadow" />
                <div className="film-sheet">
                  <span className="film-kicker">FLEXIBLE PACKAGING</span>
                  <img src={logo} width="220" height="122" alt="" />
                  <div className="film-lines"><span /><span /><span /></div>
                  <b>PRINT · LAMINATE · SLIT</b>
                </div>
                <div className="roll-core"><span /></div>
              </div>
              <p className="visual-note"><span>مصمم لخط إنتاجك</span><b>Direction / Microns / Layers</b></p>
            </div>
          </div>
          <a className="scroll-cue" href="#about"><span>استكشف</span><i /></a>
        </section>

        <section className="trust-rail" aria-label="قدرات الشركة">
          <div className="container trust-grid">
            <div><Icon name="print" /><span>طباعة فلكسوغرافية</span><small>حتى 8 ألوان</small></div>
            <div><Icon name="layers" /><span>تصفيح متقدم</span><small>حماية من الرطوبة والأكسجين</small></div>
            <div><Icon name="cut" /><span>قص وتجهيز دقيق</span><small>رولات جاهزة للإنتاج</small></div>
            <div><Icon name="map" /><span>توزيع داخل العراق</span><small>إلى جميع المحافظات</small></div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="container split-layout">
            <div className="section-heading sticky-copy">
              <p className="eyebrow"><span /> منذ 2022</p>
              <h2>مصنع متكامل.<br /><em>شريك حقيقي.</em></h2>
            </div>
            <div className="story-copy">
              <p className="lead-paragraph">بدأت HHA Packaging رحلتها في تركيا عام 2022 كجزء من مجموعة HHA Group، برؤية واضحة لتطوير معايير التغليف المرن.</p>
              <p>واليوم، من منشأتنا الصناعية المتطورة في كركوك، نجمع بين تقنيات الطباعة الحديثة ومواد التصفيح المتقدمة وخبرة فريق محترف لخدمة قطاعات الأغذية والمناديل الاستهلاكية في العراق والمنطقة.</p>
              <blockquote>“لا تُروى قصة نجاحنا بحجم الإنتاج فحسب، بل بنجاح عملائنا الذين يعتمدون على حلولنا لإبراز علاماتهم التجارية وحماية منتجاتهم بكفاءة.”<cite>حسن هادي — المؤسس</cite></blockquote>
              <div className="values-list">
                <div><Icon name="check" /><span><b>تحكم كامل بالجودة</b><small>من المواد الخام حتى القص النهائي</small></span></div>
                <div><Icon name="check" /><span><b>مرونة في التنفيذ</b><small>طلبات بمختلف الأحجام والتعقيدات</small></span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section solutions" id="solutions">
          <div className="container">
            <div className="section-intro">
              <div><p className="eyebrow light"><span /> حلولنا المتخصصة</p><h2>تغليف مدروس<br />لكل <em>منتج.</em></h2></div>
              <p>نختار المادة، السماكة، وخصائص الحماية بما يلائم طبيعة المنتج وطريقة عرضه وتشغيله.</p>
            </div>
            <div className="solutions-grid">
              {solutions.map((item) => <article className="solution-item" key={item.number}>
                <span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><a href="#contact" aria-label={`اطلب حلاً لفئة ${item.title}`}><Icon name="arrow" /></a>
              </article>)}
            </div>
            <div className="custom-solution">
              <div><span>حلول مخصصة</span><h3>منتجك خارج القالب؟</h3><p>فريقنا التقني جاهز لدراسة المواصفات واقتراح تركيبة تغليف مصممة بالكامل لاحتياجك.</p></div>
              <a className="button light-button" href="#contact">تحدث مع الفريق التقني <Icon name="arrow" size={19} /></a>
            </div>
          </div>
        </section>

        <section className="section technology" id="technology">
          <div className="container">
            <div className="section-heading center-heading">
              <p className="eyebrow"><span /> من الفكرة إلى الرول</p>
              <h2>دقة في كل <em>مرحلة.</em></h2>
              <p>سلسلة إنتاج مترابطة تضمن ثبات الجودة وسهولة التشغيل على خطوطكم.</p>
            </div>
            <div className="process-grid">
              {process.map((item, index) => <div className="process-step" key={item.step}>
                <div className="step-top"><span>{item.step}</span>{index < process.length - 1 && <i />}</div>
                <h3>{item.title}</h3><p>{item.text}</p>
              </div>)}
            </div>
            <div className="tech-feature">
              <div className="tech-graphic" aria-hidden="true"><div className="layer l1">PRINT</div><div className="layer l2">BOPP / PET</div><div className="layer l3">BARRIER</div><div className="layer l4">SEAL</div></div>
              <div className="tech-copy">
                <p className="eyebrow"><span /> تقنيات التصفيح</p>
                <h3>حماية متعددة الطبقات،<br />مبنية حسب احتياجك.</h3>
                <p>نضيف حتى ثلاث طبقات تصفيح تحت الطباعة للحماية من الرطوبة والأكسجين والضوء، مع مرونة كاملة في اختيار التركيبة.</p>
                <ul><li><Icon name="check" /> LDPE — مرونة وقوة إغلاق</li><li><Icon name="check" /> BOPP Metalized — حماية ولمعان</li><li><Icon name="check" /> CPP — شفافية وقوة إغلاق عالية</li><li><Icon name="check" /> PET Metalized — حاجز متين ومظهر مميز</li></ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section specs" id="quality">
          <div className="container specs-layout">
            <div className="specs-copy">
              <p className="eyebrow"><span /> مواصفات دقيقة</p>
              <h2>السماكة المناسبة<br />تصنع <em>الفرق.</em></h2>
              <p>نوفر نطاقاً متنوعاً من الأفلام والسماكات، مع توجيه فني لاختيار المواصفة التي تحقق الحماية والصلابة وسلاسة التشغيل.</p>
              <div className="quality-note"><strong>جودة يمكن الاعتماد عليها</strong><span>بوليمرات وأحبار عالمية، فحوص مختبرية، وثبات ألوان عبر جميع الكميات.</span></div>
            </div>
            <div className="spec-table" role="table" aria-label="سماكات مواد التغليف">
              <div className="spec-row spec-head" role="row"><span role="columnheader">المادة</span><span role="columnheader">Microns</span></div>
              {materials.map(([material, microns]) => <div className="spec-row" role="row" key={material}><b role="cell">{material}</b><span role="cell">{microns}</span></div>)}
              <div className="spec-foot">خيارات إضافية متوفرة: PET Metalized 12، LDP White 60، LDP Transparent 25.</div>
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="container contact-layout">
            <div className="contact-copy">
              <p className="eyebrow light"><span /> لنبدأ</p>
              <h2>غلاف منتجك القادم<br />يبدأ <em>بمحادثة.</em></h2>
              <p>أخبرنا عن منتجك وخط الإنتاج، وسيقوم فريقنا بمساعدتك في تحديد المادة والسماكة وتقنيات الطباعة الأنسب.</p>
              <div className="contact-list">
                <a href="tel:+9647701302524"><Icon name="phone" /><span><small>اتصل بنا</small><b dir="ltr">+964 770 130 25 24</b></span></a>
                <a href="mailto:info@hhagroup.co"><Icon name="mail" /><span><small>البريد الإلكتروني</small><b>info@hhagroup.co</b></span></a>
                <a href="https://maps.google.com/?q=Old+Industrial+Area+Kirkuk+Iraq" target="_blank" rel="noreferrer"><Icon name="map" /><span><small>مقرنا</small><b>كركوك — المنطقة الصناعية القديمة</b></span></a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-head"><span>طلب استشارة</span><small>سنفتح رسالتك مباشرة في واتساب</small></div>
              <label>الاسم الكامل<input name="name" type="text" autoComplete="name" required /></label>
              <label>اسم الشركة<input name="company" type="text" autoComplete="organization" required /></label>
              <label>رقم الهاتف<input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required /></label>
              <label>حدثنا عن المنتج<textarea name="message" rows="4" /></label>
              <button className="button primary submit-button" type="submit">إرسال عبر واتساب <Icon name="arrow" size={19} /></button>
              <p className="form-note">أو راسلنا مباشرة على <a href="mailto:info@hhagroup.co">info@hhagroup.co</a></p>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-main">
          <a className="footer-brand" href="#top"><img src={logo} width="154" height="85" loading="lazy" alt="HHA Packaging" /><span>حلول تغليف مرن مصممة لحماية منتجك وإبراز علامتك.</span></a>
          <div><b>روابط سريعة</b><a href="#about">عن الشركة</a><a href="#solutions">حلولنا</a><a href="#technology">التقنيات</a><a href="#quality">الجودة</a></div>
          <div><b>تواصل</b><a href="tel:+9647713333938" dir="ltr">+964 771 333 39 38</a><a href="tel:+9647714646405" dir="ltr">+964 771 464 64 05</a><a href="mailto:hr@hhagroup.co">hr@hhagroup.co</a><a href="https://www.hhagroup.co" target="_blank" rel="noreferrer">www.hhagroup.co</a></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} HHA Packaging. جميع الحقوق محفوظة.</span><span>عضو في مجموعة HHA Group</span></div>
      </footer>

      <a className="whatsapp-float" href="https://wa.me/9647701302524" target="_blank" rel="noreferrer" aria-label="تواصل مع HHA Packaging عبر واتساب"><span>WhatsApp</span><Icon name="phone" /></a>
    </div>
  );
}

export default App;
