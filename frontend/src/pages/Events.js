import React, { useState } from 'react';
import './Events.css';

const eventsData = [
  {
    id: 1,
    title: 'Web Development Bootcamp 2024',
    date: 'March 15–20, 2024',
    category: 'Workshop',
    status: 'completed',
    description:
      'An intensive 5-day bootcamp covering modern web development with React, Node.js, and cloud deployment. Participants built real-world projects and received mentorship from industry professionals.',
    participants: 120,
    tags: ['React', 'Node.js', 'Cloud'],
  },
  {
    id: 2,
    title: 'AI & Machine Learning Summit',
    date: 'June 8–9, 2024',
    category: 'Conference',
    status: 'completed',
    description:
      'A two-day summit exploring the latest advancements in artificial intelligence and machine learning. Featured keynotes, hands-on workshops, and networking sessions.',
    participants: 250,
    tags: ['AI', 'ML', 'Python'],
  },
  {
    id: 3,
    title: 'Cybersecurity Fundamentals',
    date: 'August 22, 2024',
    category: 'Workshop',
    status: 'completed',
    description:
      'A one-day intensive workshop on cybersecurity essentials including ethical hacking, network security, and best practices for secure software development.',
    participants: 80,
    tags: ['Security', 'Networking', 'Ethical Hacking'],
  },
  {
    id: 4,
    title: 'Data Science Hackathon',
    date: 'October 5–6, 2024',
    category: 'Hackathon',
    status: 'completed',
    description:
      'A 48-hour hackathon where teams competed to solve real-world data challenges. Prizes awarded for innovation, accuracy, and presentation quality.',
    participants: 160,
    tags: ['Data Science', 'Python', 'Visualization'],
  },
  {
    id: 5,
    title: 'Cloud Architecture Masterclass',
    date: 'January 18, 2025',
    category: 'Masterclass',
    status: 'completed',
    description:
      'An advanced masterclass on designing scalable cloud architectures using AWS, Azure, and GCP. Covered microservices, serverless, and cost optimization strategies.',
    participants: 95,
    tags: ['AWS', 'Azure', 'GCP'],
  },
  {
    id: 6,
    title: 'Full-Stack Development Sprint',
    date: 'March 10–14, 2025',
    category: 'Workshop',
    status: 'upcoming',
    description:
      'A 5-day sprint program focused on building production-ready full-stack applications. Covers TypeScript, Next.js, PostgreSQL, and CI/CD pipelines.',
    participants: 100,
    tags: ['TypeScript', 'Next.js', 'PostgreSQL'],
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
            Explore all the programs, workshops, and conferences where
            certificates were issued.
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
