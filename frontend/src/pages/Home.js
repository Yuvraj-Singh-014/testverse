import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: '🔍',
    title: 'Instant Verification',
    desc: 'Enter your name and email to instantly verify your participation and retrieve your certificate.',
  },
  {
    icon: '📄',
    title: 'PDF Certificate',
    desc: 'Receive a professionally designed, high-resolution PDF certificate ready to share or print.',
  },
  {
    icon: '🔒',
    title: 'Secure & Reliable',
    desc: 'Your data is matched securely against our verified participant records.',
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
            Certificate Portal
          </div>

          <h1 className="hero__title">
            Download Your<br />
            <span className="green-text">Certificate</span>
          </h1>

          <p className="hero__subtitle">
            Recognize your achievement. Enter your details to instantly generate
            and download your personalized certificate of completion.
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
              <span className="hero__stat-label">Certificates Issued</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value green-text">10+</span>
              <span className="hero__stat-label">Events Covered</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value green-text">100%</span>
              <span className="hero__stat-label">Verified Records</span>
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
              Three simple steps to get your certificate in seconds.
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
              Ready to download your certificate?
            </h2>
            <p className="cta-banner__subtitle">
              It only takes 30 seconds. Just enter your name and email.
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
