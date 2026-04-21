/**
 * Run this script once to generate a sample participants.xlsx file.
 *
 * Usage: node scripts/createSampleData.js
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function main() {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const participants = [
    { Name: 'Alice Johnson',  Email: 'alice@example.com',  CertificateID: 'CERT-0001' },
    { Name: 'Bob Smith',      Email: 'bob@example.com',    CertificateID: 'CERT-0002' },
    { Name: 'Carol Williams', Email: 'carol@example.com',  CertificateID: 'CERT-0003' },
    { Name: 'David Brown',    Email: 'david@example.com',  CertificateID: 'CERT-0004' },
    { Name: 'Eva Martinez',   Email: 'eva@example.com',    CertificateID: 'CERT-0005' },
    { Name: 'Frank Lee',      Email: 'frank@example.com',  CertificateID: 'CERT-0006' },
    { Name: 'Grace Kim',      Email: 'grace@example.com',  CertificateID: 'CERT-0007' },
    { Name: 'Henry Wilson',   Email: 'henry@example.com',  CertificateID: 'CERT-0008' },
  ];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Participants');

  // Define columns
  worksheet.columns = [
    { header: 'Name',          key: 'Name',          width: 25 },
    { header: 'Email',         key: 'Email',         width: 30 },
    { header: 'CertificateID', key: 'CertificateID', width: 16 },
  ];

  // Style header row
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FF00FF88' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0A0A0A' },
    };
  });

  // Add data rows
  participants.forEach((p) => worksheet.addRow(p));

  const outputPath = path.join(uploadsDir, 'participants.xlsx');
  await workbook.xlsx.writeFile(outputPath);

  console.log(`✅ Sample participants.xlsx created at: ${outputPath}`);
  console.log(`   ${participants.length} participants added.\n`);
  console.log('Sample credentials to test:');
  participants.slice(0, 3).forEach((p) => {
    console.log(`  Name: "${p.Name}"  |  Email: "${p.Email}"`);
  });
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
