const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const EXCEL_PATH = path.join(__dirname, '../../uploads/participants.xlsx');

/**
 * Reads participants from the Excel file synchronously (using ExcelJS async API wrapped).
 * Expected columns: Name, Email, CertificateID (optional)
 * Returns a Promise resolving to an array of { name, email, certificateId } objects.
 */
async function readParticipants() {
  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(
      'Participants file not found. Please upload a participants Excel file via the admin panel.'
    );
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_PATH);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('The Excel file has no worksheets.');
  }

  // Read header row (row 1)
  const headerRow = worksheet.getRow(1);
  const headers = {};
  headerRow.eachCell((cell, colNumber) => {
    const key = String(cell.value || '').trim().toLowerCase();
    headers[key] = colNumber;
  });

  if (!headers['name'] || !headers['email']) {
    throw new Error('Excel file must have "Name" and "Email" columns in the first row.');
  }

  const participants = [];
  let rowIndex = 0;

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header

    const name = String(row.getCell(headers['name']).value || '').trim();
    const email = String(row.getCell(headers['email']).value || '').trim();

    if (!name || !email) return; // skip empty rows

    // Certificate ID column (optional, various naming conventions)
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

module.exports = { readParticipants };
