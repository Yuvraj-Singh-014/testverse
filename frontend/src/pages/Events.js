import React, { useState } from 'react';
import './Events.css';

const eventsData = [
  {
    id: 1,
    title: 'Frontend Engineering Bootcamp',
    date: 'May 12, 2026',
    category: 'Workshop',
    status: 'completed',
    description:
      'A hands-on workshop focused on modern React patterns, responsive UI systems, and production frontend delivery.',
    participants: 120,
    tags: ['React', 'Design Systems', 'Frontend'],
  },
  {
    id: 2,
    title: 'AI Product Sprint',
    date: 'June 21, 2026',
    category: 'Conference',
    status: 'completed',
    description:
      'A one-day summit for builders shipping practical AI features, with talks on evaluation, tooling, and product workflows.',
    participants: 250,
    tags: ['AI', 'Evaluation', 'Product'],
  },
  {
    id: 3,
    title: 'Cloud Security Essentials',
    date: 'July 8, 2026',
    category: 'Workshop',
    status: 'completed',
    description:
      'An intensive session on secure deployment practices, secrets management, and event infrastructure hardening.',
    participants: 80,
    tags: ['Security', 'Cloud', 'DevOps'],
  },
  {
    id: 4,
    title: 'Data Systems Hack Day',
    date: 'August 16, 2026',
    category: 'Hackathon',
    status: 'completed',
    description:
      'Teams built dashboard, automation, and analytics prototypes over a focused weekend sprint.',
    participants: 160,
    tags: ['Data', 'Automation', 'Analytics'],
  },
  {
    id: 5,
    title: 'Systems Design Masterclass',
    date: 'September 5, 2026',
    category: 'Masterclass',
    status: 'completed',
    description:
      'An advanced deep dive into scalable architecture, service boundaries, and reliable delivery for growing products.',
    participants: 95,
    tags: ['Architecture', 'Scalability', 'APIs'],
  },
  {
    id: 6,
    title: 'Full-Stack Product Sprint',
    date: 'October 10, 2026',
    category: 'Workshop',
    status: 'upcoming',
    description:
      'A build week for shipping full-stack products with React, Node.js, databases, and deployment pipelines.',
    participants: 100,
    tags: ['Node.js', 'Full Stack', 'Deployment'],
  },
];

const categories = ['All', 'Workshop', 'Conference', 'Hackathon', 'Masterclass'];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? eventsData
      : eventsData.filter((e) => e.category === activeCategory);

  return (
    <div className="events-page">
      {/* ── Header ── */}
      <section className="events-hero section">
        <div className="events-hero__glow" aria-hidden="true" />
        <div className="container events-hero__content">
          <div className="badge badge-green">Events</div>
          <h1 className="section-title events-hero__title">
            Our <span className="green-text">Events</span>
          </h1>
          <p className="section-subtitle">
            Explore sample programs supported by the certificate system.
          </p>
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section className="section events-list">
        <div className="container">
          {/* Filter tabs */}
          <div className="events-filter" role="tablist" aria-label="Filter events by category">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`events-filter__btn ${activeCategory === cat ? 'events-filter__btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="events-count">
            Showing <span className="green-text">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
          </p>

          {/* Grid */}
          <div className="events-grid">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="event-card card">
      <div className="event-card__header">
        <div className="event-card__meta">
          <span className="badge badge-green">{event.category}</span>
          <span className={`event-card__status event-card__status--${event.status}`}>
            {event.status === 'upcoming' ? '🔜 Upcoming' : '✅ Completed'}
          </span>
        </div>
        <h3 className="event-card__title">{event.title}</h3>
        <div className="event-card__date">
          <span className="event-card__date-icon">📅</span>
          {event.date}
        </div>
      </div>

      <p className={`event-card__desc ${expanded ? 'event-card__desc--expanded' : ''}`}>
        {event.description}
      </p>

      <div className="event-card__footer">
        <div className="event-card__tags">
          {event.tags.map((tag) => (
            <span className="event-card__tag" key={tag}>{tag}</span>
          ))}
        </div>
        <div className="event-card__actions">
          <span className="event-card__participants">
            👥 {event.participants} participants
          </span>
          <button
            className="event-card__toggle"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {expanded ? 'Less ↑' : 'More ↓'}
          </button>
        </div>
      </div>
    </article>
  );
}
