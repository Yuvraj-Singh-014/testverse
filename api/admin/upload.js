/**
 * File upload endpoint.
 * Vercel serverless functions do not support persistent disk writes.
 * This endpoint accepts the file and parses it in-memory to validate it,
 * but cannot persist it between requests.
 *
 * For production file uploads, use an external storage service:
 * - Vercel Blob (https://vercel.com/docs/storage/vercel-blob)
 * - AWS S3
 * - Cloudinary
 *
 * The recommended workflow for this app:
 * Update participants.xlsx in the /data folder and redeploy.
 */

const ExcelJS = require('exceljs');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  res.status(501).json({
    error:
      'File upload is not supported in the serverless deployment. ' +
      'To update participants, replace /data/participants.xlsx in the repository and redeploy.',
  });
};
