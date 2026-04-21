import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: '01',
    title: 'Instant Verification',
    desc: 'Participants verify identity with the same name and email used during registration.',
  },
  {
    icon: '02',
    title: 'PDF Certificate',
    desc: 'The backend creates a polished PDF certificate on demand with the verified participant name.',
  },
  {
    icon: '03',
    title: 'Secure & Reliable',
    desc: 'Admin uploads, Excel matching, and download history give organizers a dependable workflow.',
  },
];

export default function Home() {
  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg-grid" aria-hidden="true" />
        <div className="hero__glow" aria-hidden="true" />

        <div className="container hero__content">
          <div className="badge badge-green hero__badge">
            <span className="hero__badge-dot" />
            Minimal Certificate Portal
          </div>

          <h1 className="hero__title">
            Download Your<br />
            <span className="green-text">Certificate</span>
          </h1>

          <p className="hero__subtitle">
            Download your certificate from a clean, modern portal built for events,
            bootcamps, workshops, and verified training programs.
          </p>

          <div className="hero__actions">
            <Link to="/download" className="btn btn-primary btn-lg">
              Get My Certificate →
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg">
              Learn More
            </Link>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value green-text">500+</span>
              <span className="hero__stat-label">Verified Downloads</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value green-text">10+</span>
              <span className="hero__stat-label">Live Event Sets</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value green-text">100%</span>
              <span className="hero__stat-label">Match-Based Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section features">
        <div className="container">
          <div className="features__header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              A straightforward flow for both participants and organizers.
            </p>
          </div>

          <div className="features__grid">
            {features.map((f, i) => (
              <div className="features__card card" key={i}>
                <div className="features__icon">{f.icon}</div>
                <h3 className="features__title">{f.title}</h3>
                <p className="features__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section cta-banner">
        <div className="container">
          <div className="cta-banner__inner card">
            <div className="cta-banner__glow" aria-hidden="true" />
            <h2 className="cta-banner__title">
              Ready to retrieve your certificate?
            </h2>
            <p className="cta-banner__subtitle">
              Open the download page, verify your details, and receive a PDF instantly.
            </p>
            <Link to="/download" className="btn btn-primary btn-lg">
              Download Now →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
