import React from 'react';
import './About.css';

const values = [
  { icon: '01', title: 'Verification', desc: 'Every certificate is matched against registered participant records before delivery.' },
  { icon: '02', title: 'Clarity', desc: 'A minimal interface keeps the process understandable for both mobile and desktop users.' },
  { icon: '03', title: 'Speed', desc: 'Certificates are generated the moment a valid match is found in the participant sheet.' },
  { icon: '04', title: 'Control', desc: 'Organizers can update data, review history, and manage records from one place.' },
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
            Built for Reliable<br />
            <span className="green-text">Certificate Delivery</span>
          </h1>
          <p className="section-subtitle">
            GreenCert helps organizers distribute verified certificates without
            manual searching, emailing, or last-minute file handling.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="section mission">
        <div className="container mission__grid">
          <div className="mission__text">
            <h2 className="section-title">Our Mission</h2>
            <p>
              We believe recognition should feel simple and trustworthy. GreenCert
              was designed to remove the friction between participant records and
              certificate delivery.
            </p>
            <p>
              By combining Excel-based verification, dynamic PDF generation, and a
              clean interface, the platform gives teams a practical system they can
              run locally or deploy online.
            </p>
            <div className="mission__highlight">
              <span className="green-text mission__highlight-icon">◈</span>
              <span>
                "Recognition should be immediate, accurate, and easy to trust."
              </span>
            </div>
          </div>

          <div className="mission__stats">
            {[
              { value: '1 min', label: 'Average Retrieval Flow' },
              { value: 'XLSX', label: 'Admin Data Format' },
              { value: 'PDF', label: 'Download Output' },
              { value: 'Logs', label: 'History Tracking' },
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
    </div>
  );
}
