import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import './Admin.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('upload');
  const [participants, setParticipants] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchParticipants = useCallback(async () => {
    setLoadingParticipants(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/participants`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setParticipants(data.participants || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load participants.');
    } finally {
      setLoadingParticipants(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/history`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHistory(data.history || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load history.');
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'participants') fetchParticipants();
    if (activeTab === 'history') fetchHistory();
  }, [activeTab, fetchParticipants, fetchHistory]);

  return (
    <div className="admin-page">
      {/* ── Header ── */}
      <section className="admin-hero section">
        <div className="admin-hero__glow" aria-hidden="true" />
        <div className="container admin-hero__content">
          <div className="badge badge-green">Admin Panel</div>
          <h1 className="section-title admin-hero__title">
            Admin <span className="green-text">Dashboard</span>
          </h1>
          <p className="section-subtitle">
            Upload participant data, view records, and monitor certificate downloads.
          </p>
        </div>
      </section>

      {/* ── Tabs ── */}
      <section className="section admin-content">
        <div className="container">
          <div className="admin-tabs" role="tablist">
            {[
              { id: 'upload', label: '📤 Upload Data' },
              { id: 'participants', label: '👥 Participants' },
              { id: 'history', label: '📋 Download History' },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="admin-panel">
            {activeTab === 'upload' && <UploadTab onUploaded={fetchParticipants} />}
            {activeTab === 'participants' && (
              <ParticipantsTab
                participants={participants}
                loading={loadingParticipants}
                onRefresh={fetchParticipants}
              />
            )}
            {activeTab === 'history' && (
              <HistoryTab
                history={history}
                loading={loadingHistory}
                onRefresh={fetchHistory}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Upload Tab ─────────────────────────────────────────────────────────────── */
function UploadTab({ onUploaded }) {
  return (
    <div className="upload-tab">
      <div className="upload-tab__info card">
        <h3>📋 How to Update Participants</h3>
        <p>
          This app is deployed on Vercel serverless — file uploads cannot be persisted between
          requests. To update the participant list:
        </p>
        <ol className="upload-tab__steps">
          <li>Edit <code>data/participants.xlsx</code> in the repository</li>
          <li>Commit and push the changes</li>
          <li>Vercel will automatically redeploy with the new data</li>
        </ol>
        <div className="upload-tab__table-wrap" style={{ marginTop: '20px' }}>
          <p style={{ marginBottom: '10px' }}>Your Excel file must have these columns:</p>
          <table className="upload-tab__table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Required</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Name</td><td><span className="green-text">Yes</span></td><td>Alice Johnson</td></tr>
              <tr><td>Email</td><td><span className="green-text">Yes</span></td><td>alice@example.com</td></tr>
              <tr><td>CertificateID</td><td>Optional</td><td>CERT-0001</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Participants Tab ────────────────────────────────────────────────────────── */
function ParticipantsTab({ participants, loading, onRefresh }) {
  const [search, setSearch] = useState('');

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="participants-tab">
      <div className="tab-toolbar">
        <input
          type="search"
          className="form-input tab-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline" onClick={onRefresh} disabled={loading}>
          {loading ? <span className="spinner spinner-green" /> : '↻ Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="tab-loading">
          <span className="spinner spinner-green" />
          <span>Loading participants...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="tab-empty">
          {participants.length === 0
            ? 'No participants found. Upload an Excel file first.'
            : 'No results match your search.'}
        </div>
      ) : (
        <>
          <p className="tab-count">
            <span className="green-text">{filtered.length}</span> of {participants.length} participants
          </p>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Certificate ID</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.certificateId || i}>
                    <td className="text-muted">{i + 1}</td>
                    <td>{p.name}</td>
                    <td className="text-muted">{p.email}</td>
                    <td><span className="cert-id">{p.certificateId}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ── History Tab ─────────────────────────────────────────────────────────────── */
function HistoryTab({ history, loading, onRefresh }) {
  return (
    <div className="history-tab">
      <div className="tab-toolbar">
        <p className="tab-count">
          <span className="green-text">{history.length}</span> download{history.length !== 1 ? 's' : ''} recorded
        </p>
        <button className="btn btn-outline" onClick={onRefresh} disabled={loading}>
          {loading ? <span className="spinner spinner-green" /> : '↻ Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="tab-loading">
          <span className="spinner spinner-green" />
          <span>Loading history...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="tab-empty">No downloads recorded yet.</div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Certificate ID</th>
                <th>Downloaded At</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((h, i) => (
                <tr key={i}>
                  <td className="text-muted">{i + 1}</td>
                  <td>{h.name}</td>
                  <td className="text-muted">{h.email}</td>
                  <td><span className="cert-id">{h.certificateId}</span></td>
                  <td className="text-muted">
                    {new Date(h.downloadedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
