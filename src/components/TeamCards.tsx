import type { CSSProperties, PointerEvent } from 'react';
import { useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ibrahimImage from '../assets/ibrahim.webp';
import abdalazizImage from '../assets/abdalaziz.webp';
import abdalmajidImage from '../assets/abdalmajid-abdullah.webp';
import './TeamCards.css';

type TeamMember = {
  name: string;
  role: string;
  eyebrow: string;
  description: string;
  image: string;
  imagePosition: string;
  delayClass: string;
};

const teamMembers: TeamMember[] = [
  {
    name: 'إبراهيم محمد',
    role: 'Co-founder, CEO, & CCO',
    eyebrow: 'المؤسسون',
    description: 'شريك مؤسس، المدير التنفيذي ورئيس الاتصالات',
    image: ibrahimImage,
    imagePosition: '50% 32%',
    delayClass: 'reveal-delay-1',
  },
  {
    name: 'عبد العزيز عبد الله',
    role: 'Co-founder, CTO, & CPO',
    eyebrow: 'المؤسسون',
    description: 'شريك مؤسس، المدير التقني ورئيس المنتجات',
    image: abdalazizImage,
    imagePosition: '50% 30%',
    delayClass: 'reveal-delay-2',
  },
  {
    name: 'عبد المجيد عبد الله',
    role: 'Operations, CRM & CSM',
    eyebrow: 'الإدارة والعمليات',
    description: 'مدير العمليات، مدير علاقات العملاء، ومدير نجاح العملاء',
    image: abdalmajidImage,
    imagePosition: '50% 30%',
    delayClass: 'reveal-delay-3',
  },
];

function TeamMemberMark() {
  return (
    <svg
      className="team-profile__mark"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5v14" />
      <circle cx="12" cy="12" r="8.25" />
    </svg>
  );
}

interface TeamMemberCardProps {
  index: number;
  member: TeamMember;
}

function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const cardRef = useScrollReveal<HTMLElement>();
  const pointerFrameRef = useRef<number | null>(null);
  const pointerBoundsRef = useRef<DOMRect | null>(null);
  const pointerPositionRef = useRef({ x: 50, y: 34 });

  useEffect(() => {
    return () => {
      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
    };
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return;

    const card = event.currentTarget;
    const rect = pointerBoundsRef.current ?? card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    pointerBoundsRef.current = rect;
    pointerPositionRef.current = { x, y };

    if (pointerFrameRef.current !== null) return;

    pointerFrameRef.current = window.requestAnimationFrame(() => {
      const pointer = pointerPositionRef.current;

      card.style.setProperty('--team-pointer-x', `${pointer.x * 100}%`);
      card.style.setProperty('--team-pointer-y', `${pointer.y * 100}%`);
      card.style.setProperty('--team-rotate-x', `${(0.5 - pointer.y) * 5}deg`);
      card.style.setProperty('--team-rotate-y', `${(pointer.x - 0.5) * 6}deg`);
      pointerFrameRef.current = null;
    });
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;

    if (pointerFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }

    pointerBoundsRef.current = null;
    card.style.setProperty('--team-pointer-x', '50%');
    card.style.setProperty('--team-pointer-y', '34%');
    card.style.setProperty('--team-rotate-x', '0deg');
    card.style.setProperty('--team-rotate-y', '0deg');
  };

  const imageStyle = {
    '--team-image-position': member.imagePosition,
  } as CSSProperties;

  return (
    <article
      ref={cardRef}
      className={`team-profile reveal ${member.delayClass}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-labelledby={`team-member-${index}`}
    >
      <div className="team-profile__surface">
        <div className="team-profile__media" style={imageStyle}>
          <img
            className="team-profile__image"
            src={member.image}
            alt={member.name}
            loading="lazy"
            decoding="async"
          />
          <div className="team-profile__image-shade" aria-hidden="true" />
          <div className="team-profile__spotlight" aria-hidden="true" />

          <div className="team-profile__status" aria-hidden="true">
            <span className="team-profile__status-dot" />
            Cobalt
          </div>
        </div>

        <div className="team-profile__content">
          <div className="team-profile__identity">
            <p className="team-profile__eyebrow">{member.eyebrow}</p>
            <h3 id={`team-member-${index}`} className="team-profile__name">
              {member.name}
            </h3>
            <p className="team-profile__role" dir="ltr">
              {member.role}
            </p>
          </div>

          <div className="team-profile__footer">
            <p className="team-profile__description">{member.description}</p>
            <span className="team-profile__mark-wrap">
              <TeamMemberMark />
            </span>
          </div>
        </div>

        <div className="team-profile__edge" aria-hidden="true" />
      </div>
    </article>
  );
}

export default function TeamCards() {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" className="team-showcase section" aria-labelledby="team-title">
      <div className="section-divider-line" aria-hidden="true" />
      <div className="team-showcase__ambient" aria-hidden="true" />
      <div className="team-showcase__grid-lines" aria-hidden="true" />

      <div className="container team-showcase__container">
        <header ref={headerRef} className="team-showcase__header reveal">
          <div className="team-showcase__heading">
            <span className="badge">من نحن</span>
            <h2 id="team-title">فريق العمل</h2>
          </div>

          <p className="team-showcase__intro">
            شراكة تجمع الرؤية، التواصل، التقنية، والمنتج تحت قيادة واحدة.
          </p>
        </header>

        <div className="team-showcase__cards">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
