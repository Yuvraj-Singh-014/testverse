import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-hacku">Hacku</span><span className="footer__logo-verse">Verse</span>
          </Link>
          <p className="footer__tagline">
            Recognizing achievement, one certificate at a time.
          </p>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/events">Events</Link>
            <Link to="/download">Download</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Support</h4>
            <Link to="/admin">Admin Panel</Link>
            <a href="mailto:support@certifyhub.com">Contact Support</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} HackuVerse. All rights reserved.</p>
        <p className="footer__bottom-right">Built with ♥ for achievers</p>
      </div>
    </footer>
  );
}
