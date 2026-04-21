const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function readParticipants() {
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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const participants = await readParticipants();
    res.json({ participants, count: participants.length });
  } catch (err) {
    console.error('Get participants error:', err);
    res.status(500).json({ error: 'Failed to read participants data.' });
  }
};
