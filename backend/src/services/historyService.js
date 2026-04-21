const fs = require('fs');
const path = require('path');

const HISTORY_PATH = path.join(__dirname, '../../uploads/download_history.json');

/**
 * Logs a certificate download event.
 * @param {Object} participant - { name, email, certificateId }
 */
function logDownload(participant) {
  try {
    const history = getHistory();
    history.push({
      name: participant.name,
      email: participant.email,
      certificateId: participant.certificateId,
      downloadedAt: new Date().toISOString(),
    });

    // Ensure uploads directory exists
    const dir = path.dirname(HISTORY_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf-8');
  } catch (err) {
    // Non-critical: log but don't throw
    console.error('Failed to log download history:', err.message);
  }
}

/**
 * Returns all download history entries.
 * @returns {Array}
 */
function getHistory() {
  try {
    if (!fs.existsSync(HISTORY_PATH)) return [];
    const raw = fs.readFileSync(HISTORY_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

module.exports = { logDownload, getHistory };
