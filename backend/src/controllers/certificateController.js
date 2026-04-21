const { readParticipants } = require('../services/excelService');
const { generateCertificate } = require('../services/certificateService');
const { logDownload } = require('../services/historyService');

/**
 * POST /api/certificate/verify
 * Body: { name: string, email: string }
 * Verifies participant and streams a generated PDF certificate.
 */
async function verifyCertificate(req, res) {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Read participants from Excel
    const participants = await readParticipants();

    // Match name + email (case-insensitive, trimmed)
    const participant = participants.find(
      (p) =>
        p.name.toLowerCase() === name.trim().toLowerCase() &&
        p.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!participant) {
      return res.status(404).json({
        error: 'No certificate found with the provided details. Please check your name and email.',
      });
    }

    // Generate certificate PDF
    const pdfBuffer = await generateCertificate(participant);

    // Log the download (non-blocking)
    logDownload(participant);

    // Send PDF as download
    const filename = `certificate_${participant.name.replace(/\s+/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Certificate verification error:', err);
    res.status(500).json({ error: 'Failed to generate certificate. Please try again.' });
  }
}

module.exports = { verifyCertificate };
