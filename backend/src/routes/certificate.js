const express = require('express');
const router = express.Router();
const { verifyCertificate } = require('../controllers/certificateController');

// POST /api/certificate/verify
// Verifies participant and returns a generated certificate
router.post('/verify', verifyCertificate);

module.exports = router;
