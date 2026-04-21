const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadExcel, getParticipants, getDownloadHistory } = require('../controllers/adminController');

// Configure multer for Excel file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, 'participants.xlsx');
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .xlsx and .xls files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/admin/upload - Upload participants Excel file
router.post('/upload', upload.single('file'), uploadExcel);

// GET /api/admin/participants - List all participants
router.get('/participants', getParticipants);

// GET /api/admin/history - Download history
router.get('/history', getDownloadHistory);

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
