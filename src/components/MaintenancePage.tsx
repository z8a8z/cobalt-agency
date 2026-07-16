import './MaintenancePage.css'

function MaintenancePage() {
  return (
    <main className="maintenance-page" aria-labelledby="maintenance-title">
      <section className="maintenance-card">
        <div className="construction-scene" aria-hidden="true">
          <svg className="browser-svg" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
            <path className="browser-path" d="M 15 10 L 105 10 A 5 5 0 0 1 110 15 L 110 65 A 5 5 0 0 1 105 70 L 15 70 A 5 5 0 0 1 10 65 L 10 15 A 5 5 0 0 1 15 10 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <g className="browser-inner"><line x1="10" y1="25" x2="110" y2="25" stroke="currentColor" strokeWidth="2" /><circle cx="20" cy="17" r="2.5" fill="var(--primary)" /><circle cx="28" cy="17" r="2.5" fill="var(--primary)" /><circle cx="36" cy="17" r="2.5" fill="var(--primary)" /></g>
          </svg>
          <div className="weld-spark" />
          <svg className="hammer-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="28" y="24" width="8" height="36" rx="4" fill="var(--text-muted)" /><rect x="14" y="12" width="36" height="14" rx="3" fill="var(--text-primary)" /><rect x="12" y="10" width="10" height="18" rx="2" fill="var(--primary)" /></svg>
          <div className="impact-sparks"><span className="spark-wrapper" style={{ '--rot': '-45deg' } as React.CSSProperties}><i className="spark" /></span><span className="spark-wrapper" style={{ '--rot': '0deg' } as React.CSSProperties}><i className="spark" /></span><span className="spark-wrapper" style={{ '--rot': '45deg' } as React.CSSProperties}><i className="spark" /></span></div>
        </div>

        <h1 className="brand-name" id="maintenance-title">كوبالت</h1>
        <h2 className="status">الموقع تحت الصيانة</h2>
        <p className="message">نحن نقوم حالياً بإجراء بعض التحديثات الهامة لتطوير النظام وتقديم تجربة أفضل لكم. سنعود للعمل في أقرب وقت ممكن. شكراً لصبركم وتفهمكم!</p>
        <div className="maintenance-card__status" role="status">
          <span>سنعود قريباً</span>
          <span className="maintenance-card__dots" aria-hidden="true"><i /><i /><i /></span>
        </div>
      </section>

      <p className="maintenance-page__footer">نصمم حضوراً رقمياً يليق بعملك <span>✦</span></p>
    </main>
  )
}

export default MaintenancePage
