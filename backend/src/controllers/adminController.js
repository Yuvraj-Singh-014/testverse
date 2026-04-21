const { readParticipants } = require('../services/excelService');
const { getHistory } = require('../services/historyService');

/**
 * POST /api/admin/upload
 * Handles Excel file upload (multer saves it automatically).
 */
async function uploadExcel(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Validate the file can be parsed
    const participants = await readParticipants();

    res.json({
      message: `File uploaded successfully. ${participants.length} participant(s) loaded.`,
      count: participants.length,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      error: 'Failed to process uploaded file. Ensure it has Name and Email columns.',
    });
  }
}

/**
 * GET /api/admin/participants
 * Returns all participants from the Excel file.
 */
async function getParticipants(req, res) {
  try {
    const participants = await readParticipants();
    res.json({ participants, count: participants.length });
  } catch (err) {
    console.error('Get participants error:', err);
    res.status(500).json({ error: 'Failed to read participants data.' });
  }
}

/**
 * GET /api/admin/history
 * Returns download history.
 */
function getDownloadHistory(req, res) {
  try {
    const history = getHistory();
    res.json({ history, count: history.length });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: 'Failed to read download history.' });
  }
}

module.exports = { uploadExcel, getParticipants, getDownloadHistory };
