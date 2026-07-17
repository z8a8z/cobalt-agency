import type { CSSProperties } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import cobaltLogo from '../cobalt-logo.svg';
import ibrahimImage from '../assets/ibrahim.webp';
import abdalazizImage from '../assets/abdalaziz.webp';
import abdalmajidImage from '../assets/abdalmajid-abdullah.webp';
import './TeamCards.css';

type TeamMember = {
  name: string;
  role: string;
  image: string;
  imagePosition: string;
  delayClass: string;
};

const teamMembers: TeamMember[] = [
  {
    name: 'عبد العزيز عبد الله',
    role: 'المؤسس، المدير التقني ورئيس المنتجات',
    image: abdalazizImage,
    imagePosition: '50% 30%',
    delayClass: 'reveal-delay-1',
  },
  {
    name: 'إبراهيم محمد',
    role: 'المدير التنفيذي ورئيس الاتصالات',
    image: ibrahimImage,
    imagePosition: '50% 32%',
    delayClass: 'reveal-delay-2',
  },
  {
    name: 'عبد المجيد عبد الله',
    role: 'مدير العمليات وعلاقات العملاء',
    image: abdalmajidImage,
    imagePosition: '50% 30%',
    delayClass: 'reveal-delay-3',
  },
];

function TeamMemberMark() {
  return <img className="team-profile__mark" src={cobaltLogo} alt="" />;
}

interface TeamMemberCardProps {
  index: number;
  member: TeamMember;
}

function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const cardRef = useScrollReveal<HTMLElement>();

  const imageStyle = {
    '--team-image-position': member.imagePosition,
  } as CSSProperties;

  return (
    <article
      ref={cardRef}
      className={`team-profile reveal ${member.delayClass}`}
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

        </div>

        <div className="team-profile__content">
          <div className="team-profile__identity">
            <h3 id={`team-member-${index}`} className="team-profile__name">
              {member.name}
            </h3>
            <div className="team-profile__meta">
              <p className="team-profile__role">{member.role}</p>
              <span className="team-profile__mark-wrap">
                <TeamMemberMark />
              </span>
            </div>
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
