/**
 * Download history endpoint.
 * Note: Vercel serverless functions are stateless — history is in-memory only
 * and resets on each cold start. For persistent history, connect a database
 * (e.g. Vercel Postgres, PlanetScale, MongoDB Atlas).
 */

// In-memory store (resets on cold start — acceptable for demo/MVP)
const history = [];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  res.json({ history, count: history.length });
};

// Export so verify.js can push to it (same process only — serverless caveat)
module.exports.logDownload = function (participant) {
  history.push({
    name: participant.name,
    email: participant.email,
    certificateId: participant.certificateId,
    downloadedAt: new Date().toISOString(),
  });
};
