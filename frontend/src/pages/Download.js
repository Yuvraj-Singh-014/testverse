import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './Download.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

function validate(name, email) {
  const errors = {};
  if (!name.trim()) errors.name = 'Full name is required.';
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

  if (!email.trim()) errors.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Please enter a valid email address.';

  return errors;
}

export default function Download() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validate(form.name, form.email);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE}/api/certificate/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Verification failed.');
      }

      // Trigger file download from blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${form.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus('success');
      toast.success('Certificate downloaded successfully!');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
      toast.error(err.message);
    }
  }

  function handleReset() {
    setForm({ name: '', email: '' });
    setErrors({});
    setStatus('idle');
    setErrorMsg('');
  }

  return (
    <div className="download-page">
      {/* ── Header ── */}
      <section className="download-hero section">
        <div className="download-hero__glow" aria-hidden="true" />
        <div className="container download-hero__content">
          <div className="badge badge-green">Certificate Download</div>
          <h1 className="section-title download-hero__title">
            Get Your <span className="green-text">Certificate</span>
          </h1>
          <p className="section-subtitle">
            Enter the name and email you registered with. We'll verify your
            record, generate your PDF, and start the download instantly.
          </p>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className="section download-form-section">
        <div className="container download-layout">
          {/* Form card */}
          <div className="download-card card">
            {status === 'success' ? (
              <SuccessState name={form.name} onReset={handleReset} />
            ) : (
              <>
                <div className="download-card__header">
                  <h2 className="download-card__title">Verify Your Details</h2>
                  <p className="download-card__subtitle">
                    Use the exact name and email from your registration.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="download-form">
                  {/* Name */}
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name <span className="required-star">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="e.g. Alice Johnson"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      disabled={status === 'loading'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <span id="name-error" className="field-error" role="alert">
                        ⚠ {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="e.g. alice@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      disabled={status === 'loading'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <span id="email-error" className="field-error" role="alert">
                        ⚠ {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Server error */}
                  {status === 'error' && errorMsg && (
                    <div className="server-error" role="alert">
                      <span className="server-error__icon">✕</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-primary download-submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <span>↓</span> Download Certificate
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Info sidebar */}
          <div className="download-info">
            <div className="download-info__card card">
              <h3 className="download-info__title">📋 How it works</h3>
              <ol className="download-info__steps">
                <li>Enter your registered full name</li>
                <li>Enter your registered email address</li>
                <li>We match both fields against the participant sheet</li>
                <li>Your PDF certificate downloads automatically</li>
              </ol>
            </div>

            <div className="download-info__card card">
              <h3 className="download-info__title">❓ Having trouble?</h3>
              <p className="download-info__text">
                Make sure you use the exact name and email you registered with.
                Names are case-insensitive but must match exactly.
              </p>
              <p className="download-info__text">
                If you still can't find your certificate, contact us at{' '}
                <a href="mailto:support@greencert.dev">support@greencert.dev</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SuccessState({ name, onReset }) {
  return (
    <div className="success-state">
      <div className="success-state__icon" aria-hidden="true">✓</div>
      <h2 className="success-state__title">Certificate Downloaded!</h2>
      <p className="success-state__message">
        Your certificate for <strong className="green-text">{name}</strong> has been
        generated and downloaded to your device.
      </p>
      <div className="success-state__tips">
        <p>📁 Check your Downloads folder</p>
        <p>🖨 Print or share your PDF certificate</p>
      </div>
      <button className="btn btn-outline" onClick={onReset}>
        Download Another
      </button>
    </div>
  );
}
