import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef();

  function handleFile(f) {
    if (!f) return;
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!allowed.includes(f.type) && !f.name.match(/\.(xlsx|xls)$/i)) {
      toast.error('Only .xlsx or .xls files are accepted.');
      return;
    }
    setFile(f);
    setResult(null);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult({ success: true, message: data.message, count: data.count });
      toast.success(data.message);
      onUploaded();
    } catch (err) {
      setResult({ success: false, message: err.message });
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="upload-tab">
      <div className="upload-tab__info card">
        <h3>📋 Excel File Format</h3>
        <p>Your Excel file must have the following columns (first row = headers):</p>
        <div className="upload-tab__table-wrap">
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

      {/* Drop zone */}
      <div
        className={`dropzone ${dragging ? 'dropzone--active' : ''} ${file ? 'dropzone--has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload Excel file"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="dropzone__file">
            <span className="dropzone__file-icon">📊</span>
            <div>
              <p className="dropzone__file-name">{file.name}</p>
              <p className="dropzone__file-size">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              className="dropzone__remove"
              onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="dropzone__placeholder">
            <span className="dropzone__icon">📤</span>
            <p className="dropzone__text">Drag & drop your Excel file here</p>
            <p className="dropzone__subtext">or click to browse — .xlsx, .xls accepted</p>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`upload-result ${result.success ? 'upload-result--success' : 'upload-result--error'}`}>
          {result.success ? '✅' : '❌'} {result.message}
        </div>
      )}

      <button
        className="btn btn-primary upload-btn"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? (
          <><span className="spinner" /> Uploading...</>
        ) : (
          '📤 Upload File'
        )}
      </button>
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
