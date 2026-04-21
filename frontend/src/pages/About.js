import React from 'react';
import './About.css';

const values = [
  { icon: '🎯', title: 'Excellence', desc: 'We celebrate those who go above and beyond in their learning journey.' },
  { icon: '🤝', title: 'Integrity', desc: 'Every certificate is backed by verified participation records.' },
  { icon: '🌱', title: 'Growth', desc: 'We believe in continuous learning and recognizing every milestone.' },
  { icon: '⚡', title: 'Innovation', desc: 'Modern tools to make certificate issuance fast and seamless.' },
];

const team = [
  { name: 'Sarah Chen', role: 'Program Director', initial: 'S' },
  { name: 'Marcus Reid', role: 'Technical Lead', initial: 'M' },
  { name: 'Priya Nair', role: 'Event Coordinator', initial: 'P' },
];

export default function About() {
  return (
    <div className="about">
      {/* ── Header ── */}
      <section className="about-hero section">
        <div className="about-hero__glow" aria-hidden="true" />
        <div className="container about-hero__content">
          <div className="badge badge-green">About Us</div>
          <h1 className="section-title about-hero__title">
            Empowering Achievers<br />
            <span className="green-text">Worldwide</span>
          </h1>
          <p className="section-subtitle">
            HackuVerse is a platform dedicated to recognizing the hard work and
            dedication of participants across events, workshops, and programs.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="section mission">
        <div className="container mission__grid">
          <div className="mission__text">
            <h2 className="section-title">Our Mission</h2>
            <p>
              We believe every achievement deserves recognition. HackuVerse was
              built to bridge the gap between event organizers and participants —
              making it effortless to issue, verify, and download certificates.
            </p>
            <p>
              Our platform handles everything from participant verification to
              dynamic certificate generation, so organizers can focus on what
              matters: creating great experiences.
            </p>
            <div className="mission__highlight">
              <span className="green-text mission__highlight-icon">◈</span>
              <span>
                "Recognition is the fuel that drives continued excellence."
              </span>
            </div>
          </div>

          <div className="mission__stats">
            {[
              { value: '500+', label: 'Certificates Issued' },
              { value: '10+', label: 'Events Hosted' },
              { value: '98%', label: 'Satisfaction Rate' },
              { value: '24h', label: 'Support Response' },
            ].map((s) => (
              <div className="mission__stat card" key={s.label}>
                <span className="mission__stat-value green-text">{s.value}</span>
                <span className="mission__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section values">
        <div className="container">
          <div className="values__header">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">The principles that guide everything we do.</p>
          </div>
          <div className="values__grid">
            {values.map((v) => (
              <div className="values__card card" key={v.title}>
                <div className="values__icon">{v.icon}</div>
                <h3 className="values__title">{v.title}</h3>
                <p className="values__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section team">
        <div className="container">
          <div className="team__header">
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle">The people behind CertifyHub.</p>
          </div>
          <div className="team__grid">
            {team.map((member) => (
              <div className="team__card card" key={member.name}>
                <div className="team__avatar">{member.initial}</div>
                <h3 className="team__name">{member.name}</h3>
                <p className="team__role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
