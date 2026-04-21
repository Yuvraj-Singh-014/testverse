const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// ── Excel reader ─────────────────────────────────────────────────────────────
async function readParticipants() {
  // In Vercel, files committed to the repo are available at process.cwd()
  const EXCEL_PATH = path.join(process.cwd(), 'data', 'participants.xlsx');

  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error('Participants file not found.');
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_PATH);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error('The Excel file has no worksheets.');

  const headerRow = worksheet.getRow(1);
  const headers = {};
  headerRow.eachCell((cell, colNumber) => {
    const key = String(cell.value || '').trim().toLowerCase();
    headers[key] = colNumber;
  });

  if (!headers['name'] || !headers['email']) {
    throw new Error('Excel file must have "Name" and "Email" columns.');
  }

  const participants = [];
  let rowIndex = 0;

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const name = String(row.getCell(headers['name']).value || '').trim();
    const email = String(row.getCell(headers['email']).value || '').trim();
    if (!name || !email) return;

    const certIdKey = Object.keys(headers).find((k) =>
      ['certificateid', 'certificate_id', 'cert_id', 'certid'].includes(k)
    );
    const certificateId = certIdKey
      ? String(row.getCell(headers[certIdKey]).value || '').trim() ||
        `CERT-${String(++rowIndex).padStart(4, '0')}`
      : `CERT-${String(++rowIndex).padStart(4, '0')}`;

    participants.push({ name, email, certificateId });
  });

  return participants;
}

// ── Certificate generator ────────────────────────────────────────────────────
function generateCertificate(participant) {
  return new Promise((resolve, reject) => {
    try {
      const TEMPLATE_PATH = path.join(process.cwd(), 'data', 'certificate_template.png');

      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0,
        info: {
          Title: `Certificate — ${participant.name}`,
          Author: 'HackuVerse',
          Subject: 'Certificate of Participation',
        },
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = doc.page.width;
      const H = doc.page.height;

      const usingTemplate = fs.existsSync(TEMPLATE_PATH);

      if (usingTemplate) {
        doc.image(TEMPLATE_PATH, 0, 0, { width: W, height: H });
      } else {
        // Fallback: styled dark certificate
        doc.rect(0, 0, W, H).fill('#0a0a0a');
        doc.circle(W / 2, H / 2, 280).fillOpacity(0.04).fill('#00ff88').fillOpacity(1);

        // Borders
        doc.rect(20, 20, W - 40, H - 40).lineWidth(3).strokeColor('#00ff88').stroke();
        doc.rect(32, 32, W - 64, H - 64).lineWidth(0.8).strokeColor('rgba(0,255,136,0.25)').stroke();

        // Header
        doc.rect(32, 32, W - 64, 110).fillOpacity(0.08).fill('#00ff88').fillOpacity(1);
        doc.font('Times-Bold').fontSize(28).fillColor('#00ff88')
          .text('CERTIFICATE OF PARTICIPATION', 0, 58, { align: 'center', width: W });
        doc.moveTo(W * 0.25, 148).lineTo(W * 0.75, 148).lineWidth(0.5).strokeColor('rgba(0,255,136,0.4)').stroke();
        doc.font('Times-Italic').fontSize(14).fillColor('rgba(255,255,255,0.65)')
          .text('This is to certify that', 0, 168, { align: 'center', width: W });

        // Name underline
        doc.moveTo(W * 0.2, H * 0.615).lineTo(W * 0.8, H * 0.615).lineWidth(0.8).strokeColor('rgba(0,255,136,0.4)').stroke();

        // Body
        doc.font('Helvetica').fontSize(12).fillColor('rgba(255,255,255,0.6)')
          .text(
            'has successfully participated in the program and is hereby\nawarded this certificate in recognition of their dedication.',
            0, H * 0.65, { align: 'center', width: W, lineGap: 4 }
          );

        // Signature line
        doc.moveTo(W * 0.35, H * 0.79).lineTo(W * 0.65, H * 0.79).lineWidth(0.5).strokeColor('rgba(255,255,255,0.2)').stroke();
        doc.font('Helvetica').fontSize(9).fillColor('rgba(255,255,255,0.3)')
          .text('Authorized Signature', 0, H * 0.80, { align: 'center', width: W });
      }

      // Overlay participant name
      doc
        .font('Times-Bold')
        .fontSize(36)
        .fillColor(usingTemplate ? '#1a1a1a' : '#00ff88')
        .text(participant.name, 0, H * 0.565, { align: 'center', width: W });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ── Handler ──────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const participants = await readParticipants();

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

    const pdfBuffer = await generateCertificate(participant);

    const filename = `certificate_${participant.name.replace(/\s+/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Certificate error:', err);
    res.status(500).json({ error: 'Failed to generate certificate. Please try again.' });
  }
};
