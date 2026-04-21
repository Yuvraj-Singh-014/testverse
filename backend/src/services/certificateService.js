const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const TEMPLATE_PATH = path.join(__dirname, '../../assets/certificate_template.png');

/**
 * Generates a certificate PDF buffer for the given participant using PDFKit.
 *
 * @param {Object} participant - { name, email, certificateId }
 * @returns {Promise<Buffer>} - PDF buffer
 */
function generateCertificate(participant) {
  return new Promise((resolve, reject) => {
    try {
      // A4 landscape: 841.89 x 595.28 pt
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0,
        info: {
          Title: `Certificate of Achievement — ${participant.name}`,
          Author: 'HackuVerse',
          Subject: 'Certificate of Achievement',
        },
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = doc.page.width;   // 841.89
      const H = doc.page.height;  // 595.28

      const usingTemplate = fs.existsSync(TEMPLATE_PATH);

      // ── Background ──────────────────────────────────────────────────────────
      if (usingTemplate) {
        // Use the provided template image as background
        doc.image(TEMPLATE_PATH, 0, 0, { width: W, height: H });
      } else {
        // Draw a styled certificate from scratch
        drawBackground(doc, W, H);
        drawBorders(doc, W, H);
        drawHeader(doc, W, H);
        drawBodyText(doc, W, H);
        drawSignatureLine(doc, W, H);
      }

      // ── Participant Name ─────────────────────────────────────────────────────
      // On the template: black text on the horizontal line (~56.5% from top)
      // On the fallback dark cert: green text
      doc
        .font('Times-Bold')
        .fontSize(36)
        .fillColor(usingTemplate ? '#1a1a1a' : '#00ff88')
        .text(participant.name, 0, H * 0.565, {
          align: 'center',
          width: W,
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/* ── Drawing helpers ──────────────────────────────────────────────────────── */

function drawBackground(doc, W, H) {
  // Deep black background
  doc.rect(0, 0, W, H).fill('#0a0a0a');

  // Subtle green radial glow in center (simulated with a semi-transparent ellipse)
  doc
    .circle(W / 2, H / 2, 280)
    .fillOpacity(0.04)
    .fill('#00ff88')
    .fillOpacity(1);
}

function drawBorders(doc, W, H) {
  const pad = 20;
  const pad2 = 32;

  // Outer border
  doc
    .rect(pad, pad, W - pad * 2, H - pad * 2)
    .lineWidth(3)
    .strokeColor('#00ff88')
    .stroke();

  // Inner border
  doc
    .rect(pad2, pad2, W - pad2 * 2, H - pad2 * 2)
    .lineWidth(0.8)
    .strokeColor('rgba(0,255,136,0.25)')
    .stroke();

  // Corner accents
  const cs = 36; // corner size
  const co = pad; // corner offset
  const corners = [
    [co, co, 1, 1],
    [W - co, co, -1, 1],
    [co, H - co, 1, -1],
    [W - co, H - co, -1, -1],
  ];
  doc.lineWidth(2).strokeColor('#00ff88');
  corners.forEach(([x, y, dx, dy]) => {
    doc
      .moveTo(x + dx * cs, y)
      .lineTo(x, y)
      .lineTo(x, y + dy * cs)
      .stroke();
  });
}

function drawHeader(doc, W, H) {
  // Header strip background
  doc
    .rect(32, 32, W - 64, 110)
    .fillOpacity(0.08)
    .fill('#00ff88')
    .fillOpacity(1);

  // Organization name / title
  doc
    .font('Times-Bold')
    .fontSize(28)
    .fillColor('#00ff88')
    .text('CERTIFICATE OF ACHIEVEMENT', 0, 58, { align: 'center', width: W });

  // Decorative line under header
  doc
    .moveTo(W * 0.25, 148)
    .lineTo(W * 0.75, 148)
    .lineWidth(0.5)
    .strokeColor('rgba(0,255,136,0.4)')
    .stroke();

  // "This is to certify that"
  doc
    .font('Times-Italic')
    .fontSize(14)
    .fillColor('rgba(255,255,255,0.65)')
    .text('This is to certify that', 0, 168, { align: 'center', width: W });
}

function drawBodyText(doc, W, H) {
  // Underline for name (at 56.5% — same as where name text is placed)
  doc
    .moveTo(W * 0.2, H * 0.615)
    .lineTo(W * 0.8, H * 0.615)
    .lineWidth(0.8)
    .strokeColor('rgba(0,255,136,0.4)')
    .stroke();

  // Body description
  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor('rgba(255,255,255,0.6)')
    .text(
      'has successfully completed the program and is hereby awarded this certificate\nin recognition of outstanding performance and dedication.',
      0,
      H * 0.65,
      { align: 'center', width: W, lineGap: 4 }
    );
}

function drawSignatureLine(doc, W, H) {
  // Signature line
  doc
    .moveTo(W * 0.35, H * 0.79)
    .lineTo(W * 0.65, H * 0.79)
    .lineWidth(0.5)
    .strokeColor('rgba(255,255,255,0.2)')
    .stroke();

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('rgba(255,255,255,0.3)')
    .text('Authorized Signature', 0, H * 0.80, { align: 'center', width: W });
}

module.exports = { generateCertificate };
